import { Injectable, NotFoundException, NotAcceptableException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, FindManyOptions, In, Repository } from "typeorm";
import { hexlify, randomBytes, toBeHex, ZeroAddress, zeroPadValue } from "ethers";

import type { IServerSignature, ISignatureParams } from "@gemunion/types-blockchain";
import { comparator } from "@gemunion/utils";
import { defaultChainId } from "@framework/constants";
import type { IMergeSearchDto, IMergeSignDto } from "@framework/types";
import { MergeStatus, ModuleType, SettingsKeys, TemplateStatus, TokenType } from "@framework/types";
import { SignerService } from "@framework/nest-js-module-exchange-signer";

import { SettingsService } from "../../../../../infrastructure/settings/settings.service";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { AssetEntity } from "../../../../exchange/asset/asset.entity";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { TokenEntity } from "../../../../hierarchy/token/token.entity";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { TokenService } from "../../../../hierarchy/token/token.service";
import { MergeEntity } from "./merge.entity";

@Injectable()
export class MergeService {
  constructor(
    @InjectRepository(MergeEntity)
    private readonly mergeEntityRepository: Repository<MergeEntity>,
    private readonly signerService: SignerService,
    private readonly contractService: ContractService,
    private readonly tokenService: TokenService,
    private readonly settingsService: SettingsService,
  ) {}

  public search(dto: Partial<IMergeSearchDto>, userEntity: UserEntity): Promise<[Array<MergeEntity>, number]> {
    const { query, templateId, skip, take } = dto;

    const queryBuilder = this.mergeEntityRepository.createQueryBuilder("merge");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("merge.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("merge.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.leftJoinAndSelect("merge.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");

    queryBuilder.andWhere({
      mergeStatus: MergeStatus.ACTIVE,
    });

    queryBuilder.andWhere("item_contract.chainId = :chainId", {
      chainId: userEntity?.chainId || defaultChainId,
    });

    // item or price template must be active
    queryBuilder.andWhere("item_template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });
    queryBuilder.andWhere("price_template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });

    if (templateId) {
      queryBuilder.andWhere("price_template.id = :templateId", { templateId });
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
          merchant: "merge.merchant",
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

  public findAll(
    where: FindOptionsWhere<MergeEntity>,
    options?: FindManyOptions<MergeEntity>,
  ): Promise<Array<MergeEntity>> {
    return this.mergeEntityRepository.find({ where, ...options });
  }

  public async sign(dto: IMergeSignDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { referrer = ZeroAddress, mergeId, tokenIds } = dto;
    const mergeEntity = await this.findOneWithRelations({ id: mergeId });

    if (!mergeEntity) {
      throw new NotFoundException("mergeNotFound");
    }

    const tokenEntities = await this.tokenService.findAll(
      { id: In(tokenIds) },
      {
        relations: {
          template: {
            contract: true,
          },
        },
      },
    );

    if (!tokenEntities.length) {
      throw new NotFoundException("tokenNotFound");
    }

    // test tokens and merge recipe
    // TODO test unique in DTO or in at front?
    const unique = [...new Set(tokenIds)];
    if (unique.length !== tokenIds.length) {
      throw new NotAcceptableException("wrongTokenDuplicate");
    }

    if (mergeEntity.price.components[0].amount !== tokenIds.length.toString()) {
      throw new NotAcceptableException("wrongTokenAmount");
    }

    const recipeTmplIds = mergeEntity.price.components.filter(comp => comp.templateId).map(comp => comp.templateId);
    const priceTmplIds = tokenEntities.map(token => token.templateId);

    if (recipeTmplIds.length > 0) {
      if (recipeTmplIds.length > 1) {
        throw new NotAcceptableException("wrongRecipe");
      }

      if (priceTmplIds.filter(t => t !== recipeTmplIds[0]).length > 0) {
        throw new NotAcceptableException("wrongTokenTemplate");
      }
    } else {
      const recipeCntrId = mergeEntity.price.components[0].contractId;
      if (tokenEntities.filter(t => t.template.contractId !== recipeCntrId).length > 0) {
        throw new NotAcceptableException("wrongTokenContract");
      }
    }

    const priceTemplateId = recipeTmplIds.length > 0 ? BigInt(recipeTmplIds[0] || 0) : 0n;

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;
    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId: userEntity.chainId }),
      userEntity.wallet,
      {
        externalId: mergeEntity.id,
        expiresAt,
        nonce,
        extra: zeroPadValue(toBeHex(priceTemplateId), 32),
        receiver: mergeEntity.merchant.wallet,
        referrer,
      },
      mergeEntity,
      tokenEntities,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    verifyingContract: ContractEntity,
    account: string,
    params: ISignatureParams,
    mergeEntity: MergeEntity,
    tokenEntities: Array<TokenEntity>,
  ): Promise<string> {
    return this.signerService.getManyToManySignature(
      verifyingContract,
      account,
      params,
      // ITEM to get after merge
      mergeEntity.item.components.sort(comparator("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId:
          component.contract.contractType === TokenType.ERC1155 || component.contract.contractType === TokenType.ERC20
            ? component.template.tokens[0].tokenId
            : (component.templateId || 0).toString(), // suppression types check with 0
        amount: "1",
      })),
      // PRICE token to merge
      tokenEntities.sort(comparator("tokenId")).map(tokenEntity => ({
        tokenType: Object.values(TokenType).indexOf(tokenEntity.template.contract.contractType!),
        token: tokenEntity.template.contract.address,
        tokenId: tokenEntity.tokenId,
        amount: "1",
      })),
    );
  }

  public async deactivateMerge(assets: Array<AssetEntity>): Promise<void> {
    const mergeEntities = await this.findAll(
      {
        item: In(assets.map(asset => asset.id)),
      },
      { relations: { item: { components: true } } },
    );

    for (const mergeEntity of mergeEntities) {
      await Object.assign(mergeEntity, { mergeStatus: MergeStatus.INACTIVE }).save();
    }
  }
}
