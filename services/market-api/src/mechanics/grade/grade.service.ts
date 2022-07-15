import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { BigNumber, utils, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import { IServerSignature } from "@gemunion/types-collection";
import { ContractTemplate, GradeStrategy, TokenType } from "@framework/types";

import { ILevelUpDtoDto } from "./interfaces";
import { GradeEntity } from "./grade.entity";
import { UserEntity } from "../../user/user.entity";
import { TokenEntity } from "../../blockchain/hierarchy/token/token.entity";
import { TokenService } from "../../blockchain/hierarchy/token/token.service";

export interface IAsset {
  tokenType: TokenType;
  token: string;
  tokenId: string;
  amount: string;
}

@Injectable()
export class GradeService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    @InjectRepository(GradeEntity)
    private readonly gradeEntityRepository: Repository<GradeEntity>,
  ) {}

  public async levelUp(dto: ILevelUpDtoDto, userEntity: UserEntity): Promise<IServerSignature> {
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

    const signature = await this.getSignature(nonce, tokenEntity, assetEntity, userEntity.wallet);
    return { nonce: utils.hexlify(nonce), signature };
  }

  public async getSignature(
    nonce: Uint8Array,
    tokenEntity: TokenEntity,
    assetEntity: IAsset,
    account: string,
  ): Promise<string> {
    return this.signer._signTypedData(
      // Domain
      {
        name: "MetaDataManipulator",
        version: "1.0.0",
        chainId: ~~this.configService.get<string>("CHAIN_ID", "1337"),
        verifyingContract: this.configService.get<string>("METADATA_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "nonce", type: "bytes32" },
          { name: "account", type: "address" },
          { name: "item", type: "Asset" },
          { name: "price", type: "Asset" },
        ],
        Asset: [
          { name: "tokenType", type: "uint256" },
          { name: "token", type: "address" },
          { name: "tokenId", type: "uint256" },
          { name: "amount", type: "uint256" },
        ],
      },
      // Value
      {
        nonce,
        account,
        item: {
          tokenType: Object.keys(TokenType).indexOf(tokenEntity.template.contract.contractType),
          token: tokenEntity.template.contract.address,
          tokenId: tokenEntity.id,
          amount: 1,
        },
        price: assetEntity,
      },
    );
  }

  public async calculatePrice(tokenEntity: TokenEntity): Promise<IAsset> {
    const gradeEntity = await this.findOne({ contractId: tokenEntity.template.contract.id });

    if (!gradeEntity) {
      throw new NotFoundException("gradeNotFound");
    }

    const { grade } = tokenEntity.attributes;

    let amount;

    switch (gradeEntity.gradeStrategy) {
      case GradeStrategy.FLAT:
        amount = BigNumber.from(gradeEntity.price.components[0].amount);
        break;
      case GradeStrategy.LINEAR:
        amount = BigNumber.from(gradeEntity.price.components[0].amount).mul(grade);
        break;
      case GradeStrategy.EXPONENTIAL:
        amount = BigNumber.from(gradeEntity.price.components[0].amount).mul((1 + gradeEntity.growthRate) ** grade);
        break;
      default:
        throw new BadRequestException("unknownStrategy");
    }

    return {
      tokenType: gradeEntity.price.components[0].tokenType,
      token: gradeEntity.price.components[0].contract.address,
      tokenId: gradeEntity.price.components[0].token.tokenId,
      amount: amount.toString(),
    };
  }

  public findOne(
    where: FindOptionsWhere<GradeEntity>,
    options?: FindOneOptions<GradeEntity>,
  ): Promise<GradeEntity | null> {
    return this.gradeEntityRepository.findOne({ where, ...options });
  }
}
