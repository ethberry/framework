import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindManyOptions, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";
import { hexlify, randomBytes, ZeroAddress, ZeroHash } from "ethers";

import type { IServerSignature, ISignatureParams } from "@ethberry/types-blockchain";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import { IDismantleSearchDto, IDismantleSignDto, TokenMetadata, TokenRarity } from "@framework/types";
import {
  DismantleStatus,
  DismantleStrategy,
  ModuleType,
  SettingsKeys,
  TemplateStatus,
  TokenType,
} from "@framework/types";

import { SettingsService } from "../../../../../infrastructure/settings/settings.service";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { TokenService } from "../../../../hierarchy/token/token.service";
import { TokenEntity } from "../../../../hierarchy/token/token.entity";
import { AssetEntity } from "../../../../exchange/asset/asset.entity";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { DismantleEntity } from "./dismantle.entity";
import { convertDatabaseAssetToChainAsset } from "@framework/exchange";

@Injectable()
export class DismantleService {
  constructor(
    @InjectRepository(DismantleEntity)
    private readonly dismantleEntityRepository: Repository<DismantleEntity>,
    private readonly signerService: SignerService,
    private readonly contractService: ContractService,
    private readonly tokenService: TokenService,
    private readonly settingsService: SettingsService,
  ) {}

  public search(dto: Partial<IDismantleSearchDto>): Promise<[Array<DismantleEntity>, number]> {
    const { query, templateId, skip, take } = dto;

    const queryBuilder = this.dismantleEntityRepository.createQueryBuilder("dismantle");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("dismantle.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("dismantle.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_template.contract", "item_contract");

    queryBuilder.leftJoinAndSelect(
      "item_template.tokens",
      "item_tokens",
      "item_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    queryBuilder.leftJoinAndSelect("dismantle.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_template.contract", "price_contract");

    queryBuilder.where({
      dismantleStatus: DismantleStatus.ACTIVE,
    });

    // item or price template must be active
    queryBuilder.andWhere("item_template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });
    queryBuilder.andWhere("price_template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });

    if (templateId) {
      queryBuilder.where("price_template.id = :templateId", { templateId });
    }

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
    const queryBuilder = this.dismantleEntityRepository.createQueryBuilder("dismantle");

    queryBuilder.where(where);

    queryBuilder.leftJoinAndSelect("dismantle.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("dismantle.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_template.contract", "item_contract");

    queryBuilder.leftJoinAndSelect(
      "item_template.tokens",
      "item_tokens",
      "item_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    queryBuilder.leftJoinAndSelect("dismantle.price", "price");
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

  public findAll(
    where: FindOptionsWhere<DismantleEntity>,
    options?: FindManyOptions<DismantleEntity>,
  ): Promise<Array<DismantleEntity>> {
    return this.dismantleEntityRepository.find({ where, ...options });
  }

  public async sign(dto: IDismantleSignDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { referrer = ZeroAddress, dismantleId, tokenId } = dto;
    const dismantleEntity = await this.findOneWithRelations({ id: dismantleId });

    if (!dismantleEntity) {
      throw new NotFoundException("dismantleNotFound");
    }

    const tokenEntity = await this.tokenService.findOne({ id: tokenId }, { relations: { template: true } });

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    // const rarity = Number(tokenEntity.metadata.RARITY) || 1;

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;
    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId: userEntity.chainId }),
      userEntity.wallet,
      {
        externalId: dismantleEntity.id,
        expiresAt,
        nonce,
        extra: ZeroHash,
        receiver: dismantleEntity.merchant.wallet,
        referrer,
      },
      dismantleEntity,
      tokenEntity,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    verifyingContract: ContractEntity,
    account: string,
    params: ISignatureParams,
    dismantleEntity: DismantleEntity,
    tokenEntity: TokenEntity,
  ): Promise<string> {
    const rarity = tokenEntity.metadata[TokenMetadata.RARITY] || TokenRarity.COMMON;
    const level = Object.keys(TokenRarity).indexOf(rarity);

    const items = convertDatabaseAssetToChainAsset(
      dismantleEntity.item.components,
      this.getMultiplier(level, dismantleEntity),
    );

    const price = convertDatabaseAssetToChainAsset(dismantleEntity.price.components);
    // set real token Id
    price[0].tokenId = tokenEntity.tokenId;

    return this.signerService.getManyToManySignature(verifyingContract, account, params, items, price);
  }

  public getMultiplier(level: number, { dismantleStrategy, growthRate }: DismantleEntity) {
    if (dismantleStrategy === DismantleStrategy.FLAT) {
      return 1;
    } else if (dismantleStrategy === DismantleStrategy.LINEAR) {
      return level;
    } else if (dismantleStrategy === DismantleStrategy.EXPONENTIAL) {
      return (1 + growthRate / 100) ** level;
    } else {
      throw new BadRequestException("unknownStrategy");
    }
  }

  public async deactivateDismantle(assets: Array<AssetEntity>): Promise<void> {
    const dismantleEntities = await this.findAll(
      {
        item: In(assets.map(asset => asset.id)),
      },
      { relations: { item: { components: true } } },
    );

    for (const dismantleEntity of dismantleEntities) {
      await Object.assign(dismantleEntity, { dismantleStatus: DismantleStatus.INACTIVE }).save();
    }
  }
}
