import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { constants, utils, Wallet } from "ethers";

import { prepareEip712 } from "@gemunion/butils";
import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import { IServerSignature } from "@gemunion/types-collection";
import { Erc998TokenTemplate } from "@framework/types";

import { ILevelUpDtoDto } from "./interfaces";
import { Erc998TokenService } from "../token/token.service";

@Injectable()
export class Erc998GradeService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
    private readonly erc998TokenService: Erc998TokenService,
  ) {}

  public async levelUp(dto: ILevelUpDtoDto): Promise<IServerSignature> {
    const { collection, tokenId } = dto;
    const tokenEntity = await this.erc998TokenService.getToken(collection, tokenId);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const { contractTemplate } = tokenEntity.erc998Template.erc998Collection;
    if (!(contractTemplate === Erc998TokenTemplate.GRADED || contractTemplate === Erc998TokenTemplate.RANDOM)) {
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
