import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IServerSignature } from "@ethberry/types-blockchain";
import { defaultChainId } from "@framework/constants";
import type { IPromoSearchDto, IPromoSignDto } from "@framework/types";
import { TokenType } from "@framework/types";

import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { MarketplaceService } from "../../../exchange/marketplace/marketplace.service";
import { AssetPromoEntity } from "./promo.entity";

@Injectable()
export class AssetPromoService {
  constructor(
    @InjectRepository(AssetPromoEntity)
    private readonly assetPromoEntityRepository: Repository<AssetPromoEntity>,
    private readonly marketplaceService: MarketplaceService,
  ) {}

  public async search(
    dto: Partial<IPromoSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<AssetPromoEntity>, number]> {
    const { skip, take } = dto;
    const now = new Date();

    const queryBuilder = this.assetPromoEntityRepository.createQueryBuilder("promo");

    queryBuilder.leftJoinAndSelect("promo.item", "item");
    queryBuilder.leftJoinAndSelect("promo.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_template.contract", "item_contract");

    queryBuilder.leftJoinAndSelect("promo.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_template.contract", "price_contract");

    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_tokens",
      "price_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    queryBuilder.select();

    queryBuilder.andWhere("item_contract.chainId = :chainId", {
      chainId: userEntity?.chainId || Number(defaultChainId),
    });
    queryBuilder.andWhere("promo.startTimestamp < :startTimestamp", { startTimestamp: now });
    queryBuilder.andWhere("promo.endTimestamp > :endTimestamp", { endTimestamp: now });

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

  public findOneWithRelations(where: FindOptionsWhere<TemplateEntity>): Promise<AssetPromoEntity | null> {
    const queryBuilder = this.assetPromoEntityRepository.createQueryBuilder("promo");

    queryBuilder.where(where);

    queryBuilder.leftJoinAndSelect("promo.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("promo.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_template.contract", "item_contract");

    queryBuilder.leftJoinAndSelect("promo.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_template.contract", "price_contract");

    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_tokens",
      "price_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    return queryBuilder.getOne();
  }

  public async sign(dto: IPromoSignDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { referrer, promoId, chainId, account } = dto;

    const promoEntity = await this.findOneWithRelations({ id: promoId });

    if (!promoEntity) {
      throw new NotFoundException("promoNotFound");
    }

    const now = Date.now();
    if (new Date(promoEntity.startTimestamp).getTime() > now) {
      throw new BadRequestException("promoNotYetStarted");
    }
    if (new Date(promoEntity.endTimestamp).getTime() < now) {
      throw new BadRequestException("promoAlreadyEnded");
    }

    return this.marketplaceService.sign(
      {
        referrer,
        chainId,
        account,
        templateId: promoEntity.item.components[0].templateId!,
        amount: "1",
      },
      userEntity,
    );
  }
}
