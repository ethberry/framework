import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository, DeepPartial } from "typeorm";

import { AssetType, ITemplateAutocompleteDto, ITemplateSearchDto, TemplateStatus, TokenType } from "@framework/types";
import { ITemplateCreateDto, ITemplateUpdateDto } from "./interfaces";
import { TemplateEntity } from "./template.entity";
import { AssetService } from "../../../mechanics/asset/asset.service";

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
    @Inject(forwardRef(() => AssetService))
    protected readonly assetService: AssetService,
  ) {}

  public async search(dto: ITemplateSearchDto, contractType: TokenType): Promise<[Array<TemplateEntity>, number]> {
    const { query, templateStatus, contractIds, skip, take } = dto;

    const queryBuilder = this.templateEntityRepository.createQueryBuilder("template");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    queryBuilder.andWhere("contract.contractType = :contractType", { contractType });

    if (templateStatus) {
      if (templateStatus.length === 1) {
        queryBuilder.andWhere("template.templateStatus = :templateStatus", { templateStatus: templateStatus[0] });
      } else {
        queryBuilder.andWhere("template.templateStatus IN(:...templateStatus)", { templateStatus });
      }
    }

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("template.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("template.contractId IN(:...contractIds)", { contractIds });
      }
    }

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(template.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("template.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "template.price": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: ITemplateAutocompleteDto): Promise<Array<TemplateEntity>> {
    const { templateStatus = [], contractIds = [] } = dto;

    const where = {};

    if (templateStatus.length) {
      Object.assign(where, {
        templateStatus: In(templateStatus),
      });
    }

    if (contractIds.length) {
      Object.assign(where, {
        contractId: In(contractIds),
      });
    }

    return this.templateEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<TemplateEntity>,
    options?: FindOneOptions<TemplateEntity>,
  ): Promise<TemplateEntity | null> {
    return this.templateEntityRepository.findOne({ where, ...options });
  }

  public async createTemplate(dto: ITemplateCreateDto): Promise<TemplateEntity> {
    const { price } = dto;

    const assetEntity = await this.assetService.create({
      assetType: AssetType.TEMPLATE,
      externalId: "0",
      components: [],
    });

    await this.assetService.update(assetEntity, price);

    Object.assign(dto, { price: assetEntity });

    return this.templateEntityRepository.create(dto).save();
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
        alias: "asset",
        leftJoinAndSelect: {
          price: "asset.price",
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

  public async delete(where: FindOptionsWhere<TemplateEntity>): Promise<TemplateEntity> {
    return this.update(where, { templateStatus: TemplateStatus.INACTIVE });
  }
}
