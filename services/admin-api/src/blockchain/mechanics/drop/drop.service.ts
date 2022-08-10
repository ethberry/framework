import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IPaginationDto } from "@gemunion/types-collection";

import { DropEntity } from "./drop.entity";
import { IDropCreateDto, IDropUpdateDto } from "./interfaces";
import { AssetService } from "../asset/asset.service";

@Injectable()
export class DropService {
  constructor(
    @InjectRepository(DropEntity)
    private readonly dropEntityRepository: Repository<DropEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public async search(dto: IPaginationDto): Promise<[Array<DropEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.dropEntityRepository.createQueryBuilder("drop");

    queryBuilder.leftJoinAndSelect("drop.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.select();

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "drop.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<DropEntity>,
    options?: FindOneOptions<DropEntity>,
  ): Promise<DropEntity | null> {
    return this.dropEntityRepository.findOne({ where, ...options });
  }

  public async update(where: FindOptionsWhere<DropEntity>, dto: Partial<IDropUpdateDto>): Promise<DropEntity> {
    const dropEntity = await this.findOne(where);

    if (!dropEntity) {
      throw new NotFoundException("dropNotFound");
    }

    Object.assign(dropEntity, dto);

    return dropEntity.save();
  }

  public async create(dto: IDropCreateDto): Promise<DropEntity> {
    const { price, item, ...rest } = dto;

    const priceEntity = await this.assetService.create({
      components: [],
    });
    await this.assetService.update(priceEntity, price);

    const itemEntity = await this.assetService.create({
      components: [],
    });
    await this.assetService.update(itemEntity, item);

    return this.dropEntityRepository
      .create({
        ...rest,
        price: priceEntity,
        item: itemEntity,
      })
      .save();
  }

  public findOneWithRelations(where: FindOptionsWhere<DropEntity>): Promise<DropEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "drop",
        leftJoinAndSelect: {
          item: "drop.item",
          item_components: "item.components",
          item_contract: "item_components.contract",
          item_template: "item_components.template",
          price: "drop.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
        },
      },
    });
  }
}
