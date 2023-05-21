import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { AssetService } from "../../exchange/asset/asset.service";
import { TemplateEntity } from "./template.entity";
import type { ITemplateCreateDto, ITemplateUpdateDto } from "./interfaces";

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
    @Inject(forwardRef(() => AssetService))
    protected readonly assetService: AssetService,
  ) {}

  public findOne(
    where: FindOptionsWhere<TemplateEntity>,
    options?: FindOneOptions<TemplateEntity>,
  ): Promise<TemplateEntity | null> {
    return this.templateEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<TemplateEntity>): Promise<TemplateEntity> {
    return this.templateEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<TemplateEntity>,
    dto: Partial<ITemplateUpdateDto>,
  ): Promise<TemplateEntity> {
    const { price, ...rest } = dto;
    const templateEntity = await this.findOne(where, {
      join: {
        alias: "template",
        leftJoinAndSelect: {
          price: "template.price",
          components: "price.components",
        },
      },
    });

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    Object.assign(templateEntity, rest);

    if (price) {
      await this.assetService.update(templateEntity.price, price);
    }

    return templateEntity.save();
  }

  public async createTemplate(dto: ITemplateCreateDto): Promise<TemplateEntity> {
    const assetEntity = await this.assetService.create({
      components: [],
    });

    const templateEntity = await this.templateEntityRepository
      .create({
        ...dto,
        price: assetEntity,
      })
      .save();

    return this.update({ id: templateEntity.id }, dto);
  }
}
