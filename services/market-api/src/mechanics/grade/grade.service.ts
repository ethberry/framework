import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { BigNumber, utils } from "ethers";

import { IServerSignature } from "@gemunion/types-collection";
import { ContractTemplate, GradeStrategy, TokenAttributes, TokenType } from "@framework/types";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";

import { ISignGradeDto } from "./interfaces";
import { GradeEntity } from "./grade.entity";
import { UserEntity } from "../../user/user.entity";
import { TokenEntity } from "../../blockchain/hierarchy/token/token.entity";
import { TokenService } from "../../blockchain/hierarchy/token/token.service";

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

  public async findOneByToken(where: FindOptionsWhere<TokenEntity>): Promise<GradeEntity | null> {
    const tokenEntity = await this.tokenService.findOneWithRelations(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    return this.findOneWithRelations({ contractId: tokenEntity.template.contract.id });
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

  public async sign(dto: ISignGradeDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { tokenId } = dto;
    const tokenEntity = await this.tokenService.findOneWithRelations({ id: tokenId });

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const gradeEntity = await this.findOneWithRelations({ contractId: tokenEntity.template.contract.id });

    if (!gradeEntity) {
      throw new NotFoundException("gradeNotFound");
    }

    const { contractTemplate } = tokenEntity.template.contract;
    if (!(contractTemplate === ContractTemplate.UPGRADEABLE || contractTemplate === ContractTemplate.RANDOM)) {
      throw new BadRequestException("incompatibleContractTemplate");
    }

    const nonce = utils.randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(nonce, userEntity.wallet, expiresAt, tokenEntity, gradeEntity);

    return { nonce: utils.hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    nonce: Uint8Array,
    account: string,
    expiresAt: number,
    tokenEntity: TokenEntity,
    gradeEntity: GradeEntity,
  ): Promise<string> {
    const level = tokenEntity.attributes[TokenAttributes.GRADE];

    return this.signerService.getOneToManySignature(
      account,
      {
        nonce,
        externalId: gradeEntity.id,
        expiresAt,
      },
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

  public getMultiplier(level: number, amount: string, gradeEntity: GradeEntity) {
    switch (gradeEntity.gradeStrategy) {
      case GradeStrategy.FLAT:
        return BigNumber.from(amount);
      case GradeStrategy.LINEAR:
        return BigNumber.from(amount).mul(level);
      case GradeStrategy.EXPONENTIAL:
        // eslint-disable-next-line no-case-declarations
        const exp = (1 + gradeEntity.growthRate / 100) ** level;
        // eslint-disable-next-line no-case-declarations
        const [whole = "", decimals = ""] = exp.toString().split(".");
        return BigNumber.from(amount).mul(`${whole}${decimals}`).div(BigNumber.from(10).pow(decimals.length));
      default:
        throw new BadRequestException("unknownStrategy");
    }
  }
}
