import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ContractEventType, MergeStatus, IMergeSearchDto } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { AssetService } from "../../../exchange/asset/asset.service";
import { MergeEntity } from "./merge.entity";
import type { IMergeCreateDto, IMergeUpdateDto } from "./interfaces";

@Injectable()
export class MergeService {
  constructor(
    @InjectRepository(MergeEntity)
    private readonly mergeEntityRepository: Repository<MergeEntity>,
    private readonly assetService: AssetService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public search(dto: Partial<IMergeSearchDto>, userEntity: UserEntity): Promise<[Array<MergeEntity>, number]> {
    const { query, mergeStatus, skip, take } = dto;

    const queryBuilder = this.mergeEntityRepository.createQueryBuilder("merge");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("merge.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.leftJoinAndSelect("merge.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");

    queryBuilder.andWhere("merge.merchantId = :merchantId", {
      merchantId: userEntity.merchantId,
    });

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(price_template.description->'blocks')`;
          return qb;
        },
        `blocks`,
        `TRUE`,
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("price_template.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (mergeStatus) {
      if (mergeStatus.length === 1) {
        queryBuilder.andWhere("merge.mergeStatus = :mergeStatus", { mergeStatus: mergeStatus[0] });
      } else {
        queryBuilder.andWhere("merge.mergeStatus IN(:...mergeStatus)", { mergeStatus });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<MergeEntity>,
    options?: FindOneOptions<MergeEntity>,
  ): Promise<MergeEntity | null> {
    return this.mergeEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<MergeEntity>): Promise<MergeEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "merge",
        leftJoinAndSelect: {
          item: "merge.item",
          item_components: "item.components",
          item_template: "item_components.template",
          item_contract: "item_components.contract",
          price: "merge.price",
          price_components: "price.components",
          price_template: "price_components.template",
          price_contract: "price_components.contract",
        },
      },
    });
  }

  public async create(dto: IMergeCreateDto, userEntity: UserEntity): Promise<MergeEntity> {
    const { price, item, ...rest } = dto;

    // add new price
    const priceEntity = await this.assetService.create();
    await this.assetService.update(priceEntity, price, userEntity);

    // add new item
    const itemEntity = await this.assetService.create();
    await this.assetService.update(itemEntity, item, userEntity);

    return this.mergeEntityRepository
      .create({
        price: priceEntity,
        item: itemEntity,
        merchantId: userEntity.merchantId,
        ...rest,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<MergeEntity>,
    dto: Partial<IMergeUpdateDto>,
    userEntity: UserEntity,
  ): Promise<MergeEntity> {
    const { price, item, ...rest } = dto;

    const mergeEntity = await this.findOneWithRelations(where);

    if (!mergeEntity) {
      throw new NotFoundException("mergeNotFound");
    }

    if (mergeEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    if (item) {
      await this.assetService.update(mergeEntity.item, item, userEntity);
    }

    if (price) {
      await this.assetService.update(mergeEntity.price, price, userEntity);
    }

    Object.assign(mergeEntity, rest);
    return mergeEntity.save();
  }

  public async delete(where: FindOptionsWhere<MergeEntity>, userEntity: UserEntity): Promise<void> {
    const mergeEntity = await this.findOne(where);

    if (!mergeEntity) {
      throw new NotFoundException("mergeNotFound");
    }

    if (mergeEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const count = await this.eventHistoryService.countEventsByType(ContractEventType.Merge, mergeEntity.id);

    if (count) {
      Object.assign(mergeEntity, { mergeStatus: MergeStatus.INACTIVE });
      await mergeEntity.save();
    } else {
      await mergeEntity.remove();
    }
  }
}
