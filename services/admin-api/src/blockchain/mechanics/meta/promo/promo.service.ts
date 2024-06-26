import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IPromoSearchDto } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { AssetService } from "../../../exchange/asset/asset.service";
import type { IAssetPromoCreateDto, IAssetPromoUpdateDto } from "./interfaces";
import { AssetPromoEntity } from "./promo.entity";

@Injectable()
export class AssetPromoService {
  constructor(
    @InjectRepository(AssetPromoEntity)
    private readonly assetPromoEntityRepository: Repository<AssetPromoEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public async search(
    dto: Partial<IPromoSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<AssetPromoEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.assetPromoEntityRepository.createQueryBuilder("promo");

    queryBuilder.leftJoinAndSelect("promo.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.select();

    queryBuilder.andWhere("promo.merchantId = :merchantId", {
      merchantId: userEntity.merchantId,
    });

    queryBuilder.andWhere("item_contract.chainId = :chainId", {
      chainId: userEntity.chainId,
    });

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(item_template.description->'blocks')`;
          return qb;
        },
        "blocks",
        "TRUE",
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
      "promo.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<AssetPromoEntity>,
    options?: FindOneOptions<AssetPromoEntity>,
  ): Promise<AssetPromoEntity | null> {
    return this.assetPromoEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<AssetPromoEntity>,
    dto: Partial<IAssetPromoUpdateDto>,
    userEntity: UserEntity,
  ): Promise<AssetPromoEntity> {
    const AssetPromoEntity = await this.findOne(where);

    if (!AssetPromoEntity) {
      throw new NotFoundException("promoNotFound");
    }

    if (AssetPromoEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    Object.assign(AssetPromoEntity, dto);

    return AssetPromoEntity.save();
  }

  public async create(dto: IAssetPromoCreateDto, userEntity: UserEntity): Promise<AssetPromoEntity> {
    const { price, item, ...rest } = dto;

    const priceEntity = await this.assetService.create();
    await this.assetService.update(priceEntity, price, userEntity);

    const itemEntity = await this.assetService.create();
    await this.assetService.update(itemEntity, item, userEntity);

    return this.assetPromoEntityRepository
      .create({
        ...rest,
        merchantId: userEntity.merchantId,
        price: priceEntity,
        item: itemEntity,
      })
      .save();
  }

  public findOneWithRelations(where: FindOptionsWhere<AssetPromoEntity>): Promise<AssetPromoEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "promo",
        leftJoinAndSelect: {
          item: "promo.item",
          item_components: "item.components",
          item_contract: "item_components.contract",
          item_template: "item_components.template",
          price: "promo.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
        },
      },
    });
  }

  public async delete(where: FindOptionsWhere<AssetPromoEntity>, userEntity: UserEntity): Promise<AssetPromoEntity> {
    const AssetPromoEntity = await this.findOne(where);

    if (!AssetPromoEntity) {
      throw new NotFoundException("promoNotFound");
    }

    if (AssetPromoEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    return AssetPromoEntity.remove();
  }
}
