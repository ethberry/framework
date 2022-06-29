import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { constants, utils, Wallet } from "ethers";

import { prepareEip712 } from "@gemunion/butils";
import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import { IServerSignature } from "@gemunion/types-collection";

import { ILevelUpDtoDto } from "./interfaces";
import { Erc721TokenService } from "../../erc721/token/token.service";
import { UniContractTemplate } from "@framework/types";

@Injectable()
export class Erc721GradeService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
    private readonly erc721TokenService: Erc721TokenService,
  ) {}

  public async levelUp(dto: ILevelUpDtoDto): Promise<IServerSignature> {
    const { collection, tokenId } = dto;
    const tokenEntity = await this.erc721TokenService.getToken(collection, tokenId);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const { contractTemplate } = tokenEntity.uniTemplate.uniContract;
    if (!(contractTemplate === UniContractTemplate.GRADED || contractTemplate === UniContractTemplate.RANDOM)) {
      throw new BadRequestException("wrongTokenType");
    }

    const totalTokenPrice = constants.WeiPerEther;
    const signData = {
      nonce: utils.randomBytes(32),
      collection,
      tokenId,
      price: totalTokenPrice,
    };
    const signature = await Promise.resolve(this.getSign(signData));
    return { nonce: utils.hexlify(signData.nonce), signature };
  }

  public async getSign(data: Record<string, any>): Promise<string> {
    return this.signer._signTypedData(
      {
        name: "MetaDataManipulator",
        version: "1.0.0",
        chainId: ~~this.configService.get<string>("CHAIN_ID", "1337"),
        verifyingContract: this.configService.get<string>("METADATA_ADDR", ""),
      },
      prepareEip712(data),
      data,
    );
  }
}
