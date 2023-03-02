import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository, Brackets } from "typeorm";

import type { ISearchDto } from "@gemunion/types-collection";

import { DropEntity } from "./drop.entity";
import { IDropCreateDto, IDropUpdateDto } from "./interfaces";
import { AssetService } from "../../exchange/asset/asset.service";
import { PageEntity } from "../../../infrastructure/page/page.entity";

@Injectable()
export class DropService {
  constructor(
    @InjectRepository(DropEntity)
    private readonly dropEntityRepository: Repository<DropEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public async search(dto: ISearchDto): Promise<[Array<DropEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.dropEntityRepository.createQueryBuilder("drop");

    queryBuilder.leftJoinAndSelect("drop.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.select();

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(item_template.description->'blocks')`;
          return qb;
        },
        `blocks`,
        `TRUE`,
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("item_template.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

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

  public delete(where: FindOptionsWhere<PageEntity>): Promise<DeleteResult> {
    return this.dropEntityRepository.delete(where);
  }
}
