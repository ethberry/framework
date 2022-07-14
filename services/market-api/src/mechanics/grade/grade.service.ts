import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { constants, utils, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import { IServerSignature } from "@gemunion/types-collection";
import { ContractTemplate, TokenType } from "@framework/types";

import { ILevelUpDtoDto } from "./interfaces";
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

    // TODO extract to separate function
    const assetEntity: IAsset = {
      tokenType: TokenType.NATIVE,
      token: constants.AddressZero,
      tokenId: constants.Zero.toString(),
      amount: constants.WeiPerEther.toString(),
    };

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
}
