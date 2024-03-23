import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository, In, DeleteResult } from "typeorm";

import { ContractEventType, DismantleStatus, IDismantleSearchDto, TemplateStatus } from "@framework/types";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { EventHistoryService } from "../../../../event-history/event-history.service";
import { AssetService } from "../../../../exchange/asset/asset.service";
import { DismantleEntity } from "./dismantle.entity";
import type { IDismantleCreateDto, IDismantleUpdateDto } from "./interfaces";
import { AssetEntity } from "../../../../exchange/asset/asset.entity";

@Injectable()
export class DismantleService {
  constructor(
    @InjectRepository(DismantleEntity)
    private readonly dismantleEntityRepository: Repository<DismantleEntity>,
    private readonly assetService: AssetService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public search(dto: Partial<IDismantleSearchDto>, userEntity: UserEntity): Promise<[Array<DismantleEntity>, number]> {
    const { query, dismantleStatus, skip, take } = dto;

    const queryBuilder = this.dismantleEntityRepository.createQueryBuilder("dismantle");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("dismantle.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.leftJoinAndSelect("dismantle.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");

    queryBuilder.andWhere("dismantle.merchantId = :merchantId", {
      merchantId: userEntity.merchantId,
    });

    queryBuilder.andWhere("item_contract.chainId = :chainId", {
      chainId: userEntity.chainId,
    });

    // item or price template must be active
    queryBuilder.andWhere("item_template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });
    queryBuilder.andWhere("price_template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(price_template.description->'blocks')`;
          return qb;
        },
        "blocks",
        "TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("price_template.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (dismantleStatus) {
      if (dismantleStatus.length === 1) {
        queryBuilder.andWhere("dismantle.dismantleStatus = :dismantleStatus", { dismantleStatus: dismantleStatus[0] });
      } else {
        queryBuilder.andWhere("dismantle.dismantleStatus IN(:...dismantleStatus)", { dismantleStatus });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<DismantleEntity>,
    options?: FindOneOptions<DismantleEntity>,
  ): Promise<DismantleEntity | null> {
    return this.dismantleEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<DismantleEntity>): Promise<DismantleEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "dismantle",
        leftJoinAndSelect: {
          item: "dismantle.item",
          item_components: "item.components",
          item_template: "item_components.template",
          item_contract: "item_components.contract",
          price: "dismantle.price",
          price_components: "price.components",
          price_template: "price_components.template",
          price_contract: "price_components.contract",
        },
      },
    });
  }

  public async create(dto: IDismantleCreateDto, userEntity: UserEntity): Promise<DismantleEntity> {
    const { price, item, ...rest } = dto;

    // add new price
    const priceEntity = await this.assetService.create();
    await this.assetService.update(priceEntity, price, userEntity);

    // add new item
    const itemEntity = await this.assetService.create();
    await this.assetService.update(itemEntity, item, userEntity);

    return this.dismantleEntityRepository
      .create({
        price: priceEntity,
        item: itemEntity,
        merchantId: userEntity.merchantId,
        ...rest,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<DismantleEntity>,
    dto: Partial<IDismantleUpdateDto>,
    userEntity: UserEntity,
  ): Promise<DismantleEntity> {
    const { price, item, ...rest } = dto;

    const dismantleEntity = await this.findOneWithRelations(where);

    if (!dismantleEntity) {
      throw new NotFoundException("dismantleNotFound");
    }

    if (dismantleEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    if (item) {
      await this.assetService.update(dismantleEntity.item, item, userEntity);
    }

    if (price) {
      await this.assetService.update(dismantleEntity.price, price, userEntity);
    }

    Object.assign(dismantleEntity, rest);
    return dismantleEntity.save();
  }

  public async delete(where: FindOptionsWhere<DismantleEntity>, userEntity: UserEntity): Promise<void> {
    const dismantleEntity = await this.findOne(where);

    if (!dismantleEntity) {
      throw new NotFoundException("dismantleNotFound");
    }

    if (dismantleEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const count = await this.eventHistoryService.countEventsByType(ContractEventType.Dismantle, dismantleEntity.id);

    if (count) {
      Object.assign(dismantleEntity, { dismantleStatus: DismantleStatus.INACTIVE });
      await dismantleEntity.save();
    } else {
      await dismantleEntity.remove();
    }
  }

  public async deactivateDismantle(assets: Array<AssetEntity>): Promise<DeleteResult> {
    const dismantleEntities = await this.dismantleEntityRepository.find({
      where: [
        {
          item: In(assets.map(asset => asset.id)),
        },
        {
          price: In(assets.map(asset => asset.id)),
        },
      ],
    });

    return await this.dismantleEntityRepository.delete({
      id: In(dismantleEntities.map(m => m.id)),
    });
  }
}
