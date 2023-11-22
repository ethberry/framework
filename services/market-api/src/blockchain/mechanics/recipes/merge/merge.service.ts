import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";
import { hexlify, randomBytes, toBeHex, ZeroAddress, zeroPadValue } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IMergeSearchDto, IMergeSignDto } from "@framework/types";
import { MergeStatus, ModuleType, SettingsKeys, TokenType } from "@framework/types";
import type { IParams } from "@framework/nest-js-module-exchange-signer";
import { SignerService } from "@framework/nest-js-module-exchange-signer";

import { sorter } from "../../../../common/utils/sorter";
import { SettingsService } from "../../../../infrastructure/settings/settings.service";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TokenService } from "../../../hierarchy/token/token.service";
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

  public search(dto: Partial<IMergeSearchDto>): Promise<[Array<MergeEntity>, number]> {
    const { query, templateId, skip, take } = dto;

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

    queryBuilder.where({
      mergeStatus: MergeStatus.ACTIVE,
    });

    if (templateId) {
      queryBuilder.where("price_template.id = :templateId", { templateId });
    }

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

  public async sign(dto: IMergeSignDto): Promise<IServerSignature> {
    const { account, referrer = ZeroAddress, mergeId, chainId, tokenIds } = dto;
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
    const recipeTmplIds = mergeEntity.price.components.filter(comp => comp.templateId).map(comp => comp.templateId);
    const priceTmplIds = tokenEntities.map(token => token.templateId);

    if (recipeTmplIds.length > 0) {
      if (recipeTmplIds.length > 1) {
        throw new NotFoundException("wrongRecipe");
      }

      if (priceTmplIds.filter(t => t !== recipeTmplIds[0]).length > 0) {
        throw new NotFoundException("wrongToken");
      }
    } else {
      const recipeCntrId = mergeEntity.price.components[0].contractId;

      if (tokenEntities.filter(t => t.template.contractId !== recipeCntrId).length > 0) {
        throw new NotFoundException("wrongToken");
      }
    }

    const priceTemplateId = recipeTmplIds.length > 0 ? BigInt(recipeTmplIds[0] || 0) : 0n;

    // todo next mechanic Fuze? =)
    // const rarity = Number(tokenEntities.metadata.RARITY) || 1;

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;
    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId }),
      account,
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
    params: IParams,
    mergeEntity: MergeEntity,
    tokenEntities: Array<TokenEntity>,
  ): Promise<string> {
    return this.signerService.getManyToManySignature(
      verifyingContract,
      account,
      params,
      // ITEM to get after merge
      mergeEntity.item.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId:
          component.contract.contractType === TokenType.ERC1155 || component.contract.contractType === TokenType.ERC20
            ? component.template.tokens[0].tokenId
            : (component.templateId || 0).toString(), // suppression types check with 0
        amount: "1",
      })),
      // PRICE token to merge
      tokenEntities.map(tokenEntity => ({
        tokenType: Object.values(TokenType).indexOf(tokenEntity.template.contract.contractType!),
        token: tokenEntity.template.contract.address,
        tokenId: tokenEntity.tokenId,
        amount: "1",
      })),
    );
  }
}
