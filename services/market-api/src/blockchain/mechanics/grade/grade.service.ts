import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { BigNumber, constants, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@gemunion/nest-js-module-exchange-signer";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";
import { ContractFeatures, GradeAttribute, GradeStrategy, SettingsKeys, TokenType } from "@framework/types";

import { ISearchGradeDto, ISignGradeDto } from "./interfaces";
import { GradeEntity } from "./grade.entity";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { TokenService } from "../../hierarchy/token/token.service";
import { SettingsService } from "../../../infrastructure/settings/settings.service";
import { sorter } from "../../../common/utils/sorter";

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

    // we need to get single token for Native, erc20 and erc1155
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
    const { account, referrer = constants.AddressZero, tokenId, attribute } = dto;
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

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = utils.randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;
    const signature = await this.getSignature(
      account,
      {
        nonce,
        externalId: gradeEntity.id,
        expiresAt,
        referrer,
        extra: utils.formatBytes32String("0x"),
      },
      attribute,
      tokenEntity,
      gradeEntity,
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    account: string,
    params: IParams,
    attribute: GradeAttribute,
    tokenEntity: TokenEntity,
    gradeEntity: GradeEntity,
  ): Promise<string> {
    const level = tokenEntity.attributes[attribute];

    return this.signerService.getOneToManySignature(
      account,
      params,
      {
        tokenType: Object.values(TokenType).indexOf(tokenEntity.template.contract.contractType),
        token: tokenEntity.template.contract.address,
        tokenId: tokenEntity.tokenId.toString(),
        amount: "1",
      },
      gradeEntity.price.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.template.tokens[0].tokenId,
        amount: this.getMultiplier(level, component.amount, gradeEntity).toString(),
      })),
    );
  }

  public getMultiplier(level: number, amount: string, { gradeStrategy, growthRate }: GradeEntity) {
    if (gradeStrategy === GradeStrategy.FLAT) {
      return BigNumber.from(amount);
    } else if (gradeStrategy === GradeStrategy.LINEAR) {
      return BigNumber.from(amount).mul(level);
    } else if (gradeStrategy === GradeStrategy.EXPONENTIAL) {
      const exp = (1 + growthRate / 100) ** level;
      const [whole = "", decimals = ""] = exp.toString().split(".");
      return BigNumber.from(amount).mul(`${whole}${decimals}`).div(BigNumber.from(10).pow(decimals.length));
    } else {
      throw new BadRequestException("unknownStrategy");
    }
  }
}
