import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { hexlify, randomBytes, toUtf8Bytes, ZeroAddress, zeroPadValue } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@framework/nest-js-module-exchange-signer";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import type { IDiscreteAutocompleteDto, IDiscreteSignDto } from "@framework/types";
import {
  ContractFeatures,
  DiscreteStatus,
  DiscreteStrategy,
  ModuleType,
  SettingsKeys,
  TokenType,
} from "@framework/types";

import { sorter } from "../../../../common/utils/sorter";
import { SettingsService } from "../../../../infrastructure/settings/settings.service";
import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenService } from "../../../hierarchy/token/token.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import type { IDiscreteSearchDto } from "./interfaces";
import { DiscreteEntity } from "./discrete.entity";

@Injectable()
export class DiscreteService {
  constructor(
    @InjectRepository(DiscreteEntity)
    private readonly discreteEntityRepository: Repository<DiscreteEntity>,
    private readonly tokenService: TokenService,
    private readonly signerService: SignerService,
    private readonly contractService: ContractService,
    private readonly settingsService: SettingsService,
  ) {}

  public findOne(
    where: FindOptionsWhere<DiscreteEntity>,
    options?: FindOneOptions<DiscreteEntity>,
  ): Promise<DiscreteEntity | null> {
    return this.discreteEntityRepository.findOne({ where, ...options });
  }

  public async findOneByToken(dto: IDiscreteSearchDto, merchantEntity: MerchantEntity): Promise<DiscreteEntity | null> {
    const { tokenId, attribute } = dto;

    const tokenEntity = await this.tokenService.findOneWithRelationsOrFail({ id: tokenId }, merchantEntity);

    return this.findOneWithRelations(
      {
        contractId: tokenEntity.template.contract.id,
        attribute,
      },
      merchantEntity,
    );
  }

  public async findOneWithRelations(
    where: FindOptionsWhere<DiscreteEntity>,
    merchantEntity: MerchantEntity,
  ): Promise<DiscreteEntity | null> {
    const queryBuilder = this.discreteEntityRepository.createQueryBuilder("grade");

    queryBuilder.leftJoinAndSelect("grade.price", "price");
    queryBuilder.leftJoinAndSelect("grade.contract", "contract");
    queryBuilder.leftJoinAndSelect("contract.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_tokens",
      "price_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    queryBuilder.andWhere("grade.contractId = :contractId", {
      contractId: where.contractId,
    });

    queryBuilder.andWhere("grade.attribute = :attribute", {
      attribute: where.attribute,
    });

    queryBuilder.andWhere("contract.merchantId = :merchantId", {
      merchantId: merchantEntity.id,
    });

    return queryBuilder.getOne();
  }

  public async sign(dto: IDiscreteSignDto, merchantEntity: MerchantEntity): Promise<IServerSignature> {
    const { account, referrer = ZeroAddress, tokenId, attribute, chainId } = dto;
    const tokenEntity = await this.tokenService.findOneWithRelations({ id: tokenId });

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const { contractFeatures } = tokenEntity.template.contract;
    if (!contractFeatures.includes(ContractFeatures.DISCRETE)) {
      throw new BadRequestException("featureIsNotSupported");
    }

    const discreteEntity = await this.findOneWithRelations(
      {
        contractId: tokenEntity.template.contract.id,
        attribute,
      },
      merchantEntity,
    );

    if (!discreteEntity) {
      throw new NotFoundException("gradeNotFound");
    }

    if (discreteEntity.discreteStatus !== DiscreteStatus.ACTIVE) {
      throw new ForbiddenException("gradeNotActive");
    }

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);
    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;
    const signature = await this.getSignature(
      await this.contractService.findOneOrFail({ contractModule: ModuleType.EXCHANGE, chainId }),
      account!,
      {
        externalId: discreteEntity.id,
        expiresAt,
        nonce,
        extra: zeroPadValue(toUtf8Bytes(attribute), 32),
        receiver: discreteEntity.contract.merchant.wallet,
        referrer,
      },
      attribute,
      tokenEntity,
      discreteEntity,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    verifyingContract: ContractEntity,
    account: string,
    params: IParams,
    attribute: string,
    tokenEntity: TokenEntity,
    discreteEntity: DiscreteEntity,
  ): Promise<string> {
    const level = tokenEntity.metadata[attribute] || 0;

    return this.signerService.getOneToManySignature(
      verifyingContract,
      account,
      params,
      {
        tokenType: Object.values(TokenType).indexOf(tokenEntity.template.contract.contractType!),
        token: tokenEntity.template.contract.address,
        tokenId: tokenEntity.tokenId.toString(),
        amount: "1",
      },
      discreteEntity.price.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        // tokenId: (component.templateId || 0).toString(),
        tokenId: component.template.tokens[0].tokenId,
        amount: this.getMultiplier(level, component.amount, discreteEntity).toString(),
      })),
    );
  }

  public getMultiplier(level: number, amount: string, { discreteStrategy, growthRate }: DiscreteEntity) {
    if (discreteStrategy === DiscreteStrategy.FLAT) {
      return BigInt(amount);
    } else if (discreteStrategy === DiscreteStrategy.LINEAR) {
      return BigInt(amount) * BigInt(level);
    } else if (discreteStrategy === DiscreteStrategy.EXPONENTIAL) {
      const exp = (1 + growthRate / 100) ** level;
      const [whole = "", decimals = ""] = exp.toString().split(".");
      return (BigInt(amount) * BigInt(`${whole}${decimals}`)) / BigInt(10) ** BigInt(decimals.length);
    } else {
      throw new BadRequestException("unknownStrategy");
    }
  }

  public autocomplete(dto: IDiscreteAutocompleteDto, merchantEntity: MerchantEntity): Promise<Array<DiscreteEntity>> {
    const { contractId } = dto;
    return this.discreteEntityRepository.find({
      where: {
        discreteStatus: DiscreteStatus.ACTIVE,
        contractId,
        contract: {
          merchantId: merchantEntity.id,
        },
      },
      join: {
        alias: "grade",
        leftJoinAndSelect: {
          price: "grade.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
        },
      },
    });
  }
}
