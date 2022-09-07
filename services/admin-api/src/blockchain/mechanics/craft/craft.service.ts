import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { CraftStatus, ICraftSearchDto } from "@framework/types";

import { CraftEntity } from "./craft.entity";
import { ICraftCreateDto, ICraftUpdateDto } from "./interfaces";
import { AssetService } from "../asset/asset.service";

@Injectable()
export class CraftService {
  constructor(
    @InjectRepository(CraftEntity)
    private readonly craftEntityRepository: Repository<CraftEntity>,
    private readonly assetService: AssetService,
  ) {}

  public search(dto: ICraftSearchDto): Promise<[Array<CraftEntity>, number]> {
    const { query, craftStatus, skip, take } = dto;

    const queryBuilder = this.craftEntityRepository.createQueryBuilder("craft");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("craft.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

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

    if (craftStatus) {
      if (craftStatus.length === 1) {
        queryBuilder.andWhere("craft.craftStatus = :craftStatus", { craftStatus: craftStatus[0] });
      } else {
        queryBuilder.andWhere("craft.craftStatus IN(:...craftStatus)", { craftStatus });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<CraftEntity>,
    options?: FindOneOptions<CraftEntity>,
  ): Promise<CraftEntity | null> {
    return this.craftEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<CraftEntity>): Promise<CraftEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "craft",
        leftJoinAndSelect: {
          item: "craft.item",
          item_components: "item.components",
          item_template: "item_components.template",
          item_contract: "item_components.contract",
          price: "craft.price",
          price_components: "price.components",
          price_template: "price_components.template",
          price_contract: "price_components.contract",
        },
      },
    });
  }

  public async create(dto: ICraftCreateDto): Promise<CraftEntity> {
    const { price, item } = dto;

    // add new price
    const priceEntity = await this.assetService.create({
      components: [],
    });
    await this.assetService.update(priceEntity, price);

    // add new item
    const itemEntity = await this.assetService.create({
      components: [],
    });
    await this.assetService.update(itemEntity, item);

    return this.craftEntityRepository
      .create({
        price: priceEntity,
        item: itemEntity,
      })
      .save();
  }

  public async update(where: FindOptionsWhere<CraftEntity>, dto: Partial<ICraftUpdateDto>): Promise<CraftEntity> {
    const { price, ...rest } = dto;

    const craftEntity = await this.findOneWithRelations(where);

    if (!craftEntity) {
      throw new NotFoundException("craftNotFound");
    }

    if (price) {
      await this.assetService.update(craftEntity.price, price);
    }

    Object.assign(craftEntity, rest);

    return craftEntity.save();
  }

  public async delete(where: FindOptionsWhere<CraftEntity>): Promise<void> {
    const craftEntity = await this.findOne(where);

    if (!craftEntity) {
      return;
    }

    if (craftEntity.craftStatus === CraftStatus.NEW) {
      await craftEntity.remove();
    } else {
      Object.assign(craftEntity, { craftStatus: CraftStatus.INACTIVE });
      await craftEntity.save();
    }
  }
}
