import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { encodeBytes32String, hexlify, randomBytes, ZeroAddress } from "ethers";

import type { IPaginationDto } from "@gemunion/types-collection";
import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@framework/nest-js-module-exchange-signer";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import { ModuleType, SettingsKeys, TokenType } from "@framework/types";

import type { IAssetPromoSignDto } from "./interfaces";
import { AssetPromoEntity } from "./promo.entity";
import { TemplateEntity } from "../../hierarchy/template/template.entity";
import { TemplateService } from "../../hierarchy/template/template.service";
import { SettingsService } from "../../../infrastructure/settings/settings.service";
import { sorter } from "../../../common/utils/sorter";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";
import { MysteryBoxEntity } from "../mystery/box/box.entity";

@Injectable()
export class AssetPromoService {
  constructor(
    @InjectRepository(AssetPromoEntity)
    private readonly assetPromoEntityRepository: Repository<AssetPromoEntity>,
    private readonly templateService: TemplateService,
    private readonly signerService: SignerService,
    private readonly contractService: ContractService,
    private readonly settingsService: SettingsService,
  ) {}

  public async search(dto: Partial<IPaginationDto>): Promise<[Array<AssetPromoEntity>, number]> {
    const { skip, take } = dto;
    const now = new Date();

    const queryBuilder = this.assetPromoEntityRepository.createQueryBuilder("promo");

    queryBuilder.leftJoinAndSelect("promo.item", "item");
    queryBuilder.leftJoinAndSelect("promo.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    // JOIN MYSTERY-BOXES IF ANY
    queryBuilder.leftJoinAndMapOne(
      "promo.box",
      MysteryBoxEntity,
      "box",
      `item_template.id = item_template.id AND item_contract.contractModule = '${ModuleType.MYSTERY}'`,
    );

    queryBuilder.leftJoinAndSelect("box.item", "box_item");
    queryBuilder.leftJoinAndSelect("box_item.components", "box_item_components");
    queryBuilder.leftJoinAndSelect("box_item_components.template", "box_item_template");
    queryBuilder.leftJoinAndSelect("box_item_components.contract", "box_item_contract");

    queryBuilder.leftJoinAndSelect(
      "box_item_template.tokens",
      "box_item_tokens",
      "box_item_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    queryBuilder.leftJoinAndSelect("promo.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_tokens",
      "price_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    queryBuilder.select();

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

    queryBuilder.leftJoinAndSelect("promo.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("promo.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");

    // JOIN MYSTERY-BOXES IF ANY
    queryBuilder.leftJoinAndMapOne(
      "promo.box",
      MysteryBoxEntity,
      "box",
      `item_template.id = item_template.id AND item_contract.contractModule = '${ModuleType.MYSTERY}'`,
    );

    queryBuilder.leftJoinAndSelect("box.item", "box_item");
    queryBuilder.leftJoinAndSelect("box_item.components", "box_item_components");
    queryBuilder.leftJoinAndSelect("box_item_components.template", "box_item_template");
    queryBuilder.leftJoinAndSelect("box_item_components.contract", "box_item_contract");

    queryBuilder.leftJoinAndSelect(
      "box_item_template.tokens",
      "box_item_tokens",
      "box_item_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    queryBuilder.leftJoinAndSelect("promo.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_tokens",
      "price_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );
    queryBuilder.andWhere("promo.id = :id", {
      id: where.id,
    });
    return queryBuilder.getOne();
  }

  public async sign(dto: IAssetPromoSignDto): Promise<IServerSignature> {
    const { account, referrer = ZeroAddress, promoId, chainId } = dto;

    const AssetPromoEntity = await this.findOneWithRelations({ id: promoId });

    if (!AssetPromoEntity) {
      throw new NotFoundException("promoNotFound");
    }

    const now = Date.now();
    if (new Date(AssetPromoEntity.startTimestamp).getTime() > now) {
      throw new BadRequestException("promoNotYetStarted");
    }
    if (new Date(AssetPromoEntity.endTimestamp).getTime() < now) {
      throw new BadRequestException("promoAlreadyEnded");
    }
    const templateEntity = await this.templateService.findOne({
      id: AssetPromoEntity.item.components[0].templateId!,
    });

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const cap = BigInt(templateEntity.cap);
    if (cap > 0 && cap <= BigInt(templateEntity.amount)) {
      throw new BadRequestException("limitExceeded");
    }

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;

    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId }),
      account,
      {
        externalId: AssetPromoEntity.id,
        expiresAt,
        nonce,
        extra: encodeBytes32String("0x"),
        receiver: AssetPromoEntity.merchant.wallet,
        referrer,
      },
      AssetPromoEntity,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    verifyingContract: ContractEntity,
    account: string,
    params: IParams,
    assetPromoEntity: AssetPromoEntity,
  ): Promise<string> {
    const mysteryComponents =
      assetPromoEntity.item?.components.filter(component => component.contract.contractModule === ModuleType.MYSTERY)
        .length > 0;

    return mysteryComponents
      ? this.signerService.getManyToManySignature(
          verifyingContract,
          account,
          params,
          [
            ...assetPromoEntity.box!.item.components.sort(sorter("id")).map(component => ({
              tokenType: Object.values(TokenType).indexOf(component.tokenType),
              token: component.contract.address,
              // tokenId: component.templateId || 0,
              tokenId:
                component.contract.contractType === TokenType.ERC1155
                  ? component.template.tokens[0].tokenId
                  : (component.templateId || 0).toString(),
              amount: component.amount,
            })),
            assetPromoEntity.item?.components.sort(sorter("id")).map(component => ({
              tokenType: Object.values(TokenType).indexOf(component.tokenType),
              token: component.contract.address,
              tokenId: (component.templateId || 0).toString(), // suppression types check with 0
              amount: component.amount,
            }))[0],
          ],
          assetPromoEntity.price.components.sort(sorter("id")).map(component => ({
            tokenType: Object.values(TokenType).indexOf(component.tokenType),
            token: component.contract.address,
            tokenId: component.template.tokens[0].tokenId,
            amount: component.amount,
          })),
        )
      : this.signerService.getOneToManySignature(
          verifyingContract,
          account,
          params,
          assetPromoEntity.item.components.sort(sorter("id")).map(component => ({
            tokenType: Object.values(TokenType).indexOf(component.tokenType),
            token: component.contract.address,
            tokenId: (component.templateId || 0).toString(), // suppression types check with 0
            amount: component.amount,
          }))[0],
          assetPromoEntity.price.components.sort(sorter("id")).map(component => ({
            tokenType: Object.values(TokenType).indexOf(component.tokenType),
            token: component.contract.address,
            tokenId: component.template.tokens[0].tokenId,
            amount: component.amount,
          })),
        );
  }
}
