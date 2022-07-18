import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { BigNumber, utils } from "ethers";
import { IServerSignature } from "@gemunion/types-collection";
import { ContractTemplate, GradeStrategy, TokenAttributes, TokenType } from "@framework/types";

import { IGradeDto } from "./interfaces";
import { GradeEntity } from "./grade.entity";
import { UserEntity } from "../../user/user.entity";
import { TokenEntity } from "../../blockchain/hierarchy/token/token.entity";
import { TokenService } from "../../blockchain/hierarchy/token/token.service";
import { IAsset, SignerService } from "../signer/signer.service";

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

  public async sign(dto: IGradeDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { tokenId } = dto;
    const tokenEntity = await this.tokenService.findOne(
      { id: tokenId },
      {
        join: {
          alias: "token",
          leftJoinAndSelect: {
            template: "token.template",
            contract: "template.contract",
          },
        },
      },
    );

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const { contractTemplate } = tokenEntity.template.contract;
    if (!(contractTemplate === ContractTemplate.GRADED || contractTemplate === ContractTemplate.RANDOM)) {
      throw new BadRequestException("incompatibleContractTemplate");
    }

    const assetEntity = await this.calculatePrice(tokenEntity);

    const nonce = utils.randomBytes(32);

    const signature = await this.getSignature(nonce, userEntity.wallet, tokenEntity, assetEntity);
    return { nonce: utils.hexlify(nonce), signature };
  }

  public async getSignature(
    nonce: Uint8Array,
    account: string,
    tokenEntity: TokenEntity,
    assetEntity: IAsset,
  ): Promise<string> {
    return this.signerService.getSignature(
      nonce,
      account,
      [
        {
          tokenType: Object.keys(TokenType).indexOf(tokenEntity.template.contract.contractType),
          token: tokenEntity.template.contract.address,
          tokenId: tokenEntity.tokenId.toString(),
          amount: "1",
        },
      ],
      [assetEntity],
    );
  }

  public async calculatePrice(tokenEntity: TokenEntity): Promise<IAsset> {
    const gradeEntity = await this.findOne(
      { contractId: tokenEntity.template.contract.id },
      {
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
      },
    );

    if (!gradeEntity) {
      throw new NotFoundException("gradeNotFound");
    }

    const grade = tokenEntity.attributes[TokenAttributes.GRADE];

    let amount;

    switch (gradeEntity.gradeStrategy) {
      case GradeStrategy.FLAT:
        amount = BigNumber.from(gradeEntity.price.components[0].amount);
        break;
      case GradeStrategy.LINEAR:
        amount = BigNumber.from(gradeEntity.price.components[0].amount).mul(grade);
        break;
      case GradeStrategy.EXPONENTIAL:
        amount = BigNumber.from(gradeEntity.price.components[0].amount).mul(
          (1 + gradeEntity.growthRate / 100) ** grade,
        );
        break;
      default:
        throw new BadRequestException("unknownStrategy");
    }

    return {
      tokenType: Object.keys(TokenType).indexOf(gradeEntity.price.components[0].tokenType),
      token: gradeEntity.price.components[0].contract.address,
      tokenId: gradeEntity.price.components[0].template.tokens[0].tokenId,
      amount: amount.toString(),
    };
  }
}
