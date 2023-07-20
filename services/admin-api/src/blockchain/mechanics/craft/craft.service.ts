import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ContractEventType, CraftStatus, ICraftSearchDto } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { EventHistoryService } from "../../event-history/event-history.service";
import { AssetService } from "../../exchange/asset/asset.service";
import { CraftEntity } from "./craft.entity";
import type { ICraftCreateDto, ICraftUpdateDto } from "./interfaces";

@Injectable()
export class CraftService {
  constructor(
    @InjectRepository(CraftEntity)
    private readonly craftEntityRepository: Repository<CraftEntity>,
    private readonly assetService: AssetService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public search(dto: ICraftSearchDto, userEntity: UserEntity): Promise<[Array<CraftEntity>, number]> {
    const { query, craftStatus, skip, take } = dto;

    const queryBuilder = this.craftEntityRepository.createQueryBuilder("craft");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("craft.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.andWhere("craft.merchantId = :merchantId", {
      merchantId: userEntity.merchantId,
    });

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

  public async create(dto: ICraftCreateDto, userEntity: UserEntity): Promise<CraftEntity> {
    const { price, item } = dto;

    // add new price
    const priceEntity = await this.assetService.create();
    await this.assetService.update(priceEntity, price, userEntity);

    // add new item
    const itemEntity = await this.assetService.create();
    await this.assetService.update(itemEntity, item, userEntity);

    return this.craftEntityRepository
      .create({
        price: priceEntity,
        item: itemEntity,
        merchantId: userEntity.merchantId,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<CraftEntity>,
    dto: Partial<ICraftUpdateDto>,
    userEntity: UserEntity,
  ): Promise<CraftEntity> {
    const { price, item, ...rest } = dto;

    const craftEntity = await this.findOneWithRelations(where);

    if (!craftEntity) {
      throw new NotFoundException("craftNotFound");
    }

    if (craftEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    if (item) {
      await this.assetService.update(craftEntity.item, item, userEntity);
    }

    if (price) {
      await this.assetService.update(craftEntity.price, price, userEntity);
    }

    Object.assign(craftEntity, rest);
    return craftEntity.save();
  }

  public async delete(where: FindOptionsWhere<CraftEntity>, userEntity: UserEntity): Promise<void> {
    const craftEntity = await this.findOne(where);

    if (!craftEntity) {
      throw new NotFoundException("craftNotFound");
    }

    if (craftEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const count = await this.eventHistoryService.countEventsByType(ContractEventType.Craft, craftEntity.id);

    if (count) {
      Object.assign(craftEntity, { craftStatus: CraftStatus.INACTIVE });
      await craftEntity.save();
    } else {
      await craftEntity.remove();
    }
  }
}
