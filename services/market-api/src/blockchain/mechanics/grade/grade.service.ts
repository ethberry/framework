import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { BigNumber, constants, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { ContractFeatures, GradeAttribute, GradeStrategy, TokenType } from "@framework/types";
import { IParams, SignerService } from "@framework/nest-js-module-exchange-signer";

import { ISignGradeDto } from "./interfaces";
import { GradeEntity } from "./grade.entity";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { TokenService } from "../../hierarchy/token/token.service";

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(GradeEntity)
    private readonly gradeEntityRepository: Repository<GradeEntity>,
    private readonly tokenService: TokenService,
    private readonly signerService: SignerService,
  ) {}

  public findOne(
    where: FindOptionsWhere<GradeEntity>,
    options?: FindOneOptions<GradeEntity>,
  ): Promise<GradeEntity | null> {
    return this.gradeEntityRepository.findOne({ where, ...options });
  }

  public async findOneByToken(dto: ISignGradeDto): Promise<GradeEntity | null> {
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
    return this.findOne(where, {
      join: {
        alias: "grade",
        leftJoinAndSelect: {
          price: "grade.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
          price_tokens: "price_template.tokens",
        },
      },
    });
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

    const nonce = utils.randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(
      account,
      {
        nonce,
        externalId: gradeEntity.id,
        expiresAt,
        referrer,
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
        tokenType: Object.keys(TokenType).indexOf(tokenEntity.template.contract.contractType),
        token: tokenEntity.template.contract.address,
        tokenId: tokenEntity.tokenId.toString(),
        amount: "1",
      },
      gradeEntity.price.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
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
