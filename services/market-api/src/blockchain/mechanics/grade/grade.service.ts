import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { hexlify, randomBytes, toUtf8Bytes, ZeroAddress, zeroPadValue } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@gemunion/nest-js-module-exchange-signer";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";
import { ContractFeatures, GradeStatus, GradeStrategy, SettingsKeys, TokenType } from "@framework/types";

import { sorter } from "../../../common/utils/sorter";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { TokenService } from "../../hierarchy/token/token.service";
import { SettingsService } from "../../../infrastructure/settings/settings.service";
import type { IAutocompleteGradeDto, ISearchGradeDto, ISignGradeDto } from "./interfaces";
import { GradeEntity } from "./grade.entity";

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(GradeEntity)
    private readonly gradeEntityRepository: Repository<GradeEntity>,
    private readonly tokenService: TokenService,
    private readonly signerService: SignerService,
    private readonly settingsService: SettingsService,
  ) {}

  public findOne(
    where: FindOptionsWhere<GradeEntity>,
    options?: FindOneOptions<GradeEntity>,
  ): Promise<GradeEntity | null> {
    return this.gradeEntityRepository.findOne({ where, ...options });
  }

  public async findOneByToken(dto: ISearchGradeDto): Promise<GradeEntity | null> {
    const { tokenId, attribute } = dto;

    const tokenEntity = await this.tokenService.findOneWithRelations({ id: tokenId });

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    return this.findOneWithRelations({
      contractId: tokenEntity.template.contract.id,
      attribute,
    });
  }

  public async findOneWithRelations(where: FindOptionsWhere<GradeEntity>): Promise<GradeEntity | null> {
    const queryBuilder = this.gradeEntityRepository.createQueryBuilder("grade");

    queryBuilder.leftJoinAndSelect("grade.price", "price");
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

    return queryBuilder.getOne();
  }

  public async sign(dto: ISignGradeDto): Promise<IServerSignature> {
    const { account, referrer = ZeroAddress, tokenId, attribute } = dto;
    const tokenEntity = await this.tokenService.findOneWithRelations({ id: tokenId });

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const { contractFeatures } = tokenEntity.template.contract;
    if (!contractFeatures.includes(ContractFeatures.UPGRADEABLE)) {
      throw new BadRequestException("featureIsNotSupported");
    }

    const gradeEntity = await this.findOneWithRelations({
      contractId: tokenEntity.template.contract.id,
      attribute,
    });

    if (!gradeEntity) {
      throw new NotFoundException("gradeNotFound");
    }

    if (gradeEntity.gradeStatus !== GradeStatus.ACTIVE) {
      throw new ForbiddenException("gradeNotActive");
    }

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);
    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;
    const signature = await this.getSignature(
      account,
      {
        externalId: gradeEntity.id,
        expiresAt,
        nonce,
        extra: zeroPadValue(toUtf8Bytes(attribute), 32),
        receiver: ZeroAddress,
        referrer,
      },
      attribute,
      tokenEntity,
      gradeEntity,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    account: string,
    params: IParams,
    attribute: string,
    tokenEntity: TokenEntity,
    gradeEntity: GradeEntity,
  ): Promise<string> {
    const level = tokenEntity.metadata[attribute] || 0;

    return this.signerService.getOneToManySignature(
      account,
      params,
      {
        tokenType: Object.values(TokenType).indexOf(tokenEntity.template.contract.contractType!),
        token: tokenEntity.template.contract.address,
        tokenId: tokenEntity.tokenId.toString(),
        amount: "1",
      },
      gradeEntity.price.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        // tokenId: (component.templateId || 0).toString(),
        tokenId: component.template.tokens[0].tokenId,
        amount: this.getMultiplier(level, component.amount, gradeEntity).toString(),
      })),
    );
  }

  public getMultiplier(level: number, amount: string, { gradeStrategy, growthRate }: GradeEntity) {
    if (gradeStrategy === GradeStrategy.FLAT) {
      return BigInt(amount);
    } else if (gradeStrategy === GradeStrategy.LINEAR) {
      return BigInt(amount) * BigInt(level);
    } else if (gradeStrategy === GradeStrategy.EXPONENTIAL) {
      const exp = (1 + growthRate / 100) ** level;
      const [whole = "", decimals = ""] = exp.toString().split(".");
      return (BigInt(amount) * BigInt(`${whole}${decimals}`)) / BigInt(10) ** BigInt(decimals.length);
    } else {
      throw new BadRequestException("unknownStrategy");
    }
  }

  public autocomplete(dto: IAutocompleteGradeDto): Promise<Array<GradeEntity>> {
    const { contractId } = dto;
    return this.gradeEntityRepository.find({
      where: {
        gradeStatus: GradeStatus.ACTIVE,
        contractId,
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
