import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BigNumber, constants, utils, Wallet } from "ethers";
import { prepareEip712 } from "@gemunion/butils";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import { IServerSignature } from "@gemunion/types-collection";
import { UniContractTemplate } from "@framework/types";

import { ISignTokensDto } from "./interfaces";
import { Erc1155TemplateService } from "../template/template.service";

@Injectable()
export class Erc1155MarketplaceService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
    private readonly erc1155TemplateService: Erc1155TemplateService,
  ) {}

  public async signToken(dto: ISignTokensDto): Promise<IServerSignature> {
    let totalTokenPrice = utils.parseEther("0");
    const collections: Array<string> = [];
    const tokenIds: Array<number> = [];
    await Promise.all(
      dto.erc1155TokenIds.map(async (erc1155TokenId, index) => {
        const tokenEntity = await this.erc1155TemplateService.findOne(
          { id: erc1155TokenId },
          { relations: { uniContract: true } },
        );

        if (!tokenEntity) {
          throw new NotFoundException("tokenNotFound");
        }

        if (tokenEntity.amount > 0 && tokenEntity.amount <= tokenEntity.instanceCount) {
          throw new NotFoundException("limitExceeded");
        }

        const tokenPrice =
          tokenEntity.price.components[0].uniContract.contractTemplate === UniContractTemplate.ERC20_NATIVE
            ? BigNumber.from(tokenEntity.price).mul(dto.amounts[index])
            : constants.Zero;
        totalTokenPrice = totalTokenPrice.add(tokenPrice);
        collections.push(tokenEntity.uniContract.address);
        // tokenIds.push(~~tokenEntity.tokenId);
      }),
    );

    // Must be in one collection
    if (!collections.every((val, i, arr) => val === arr[0])) {
      throw new NotFoundException("collectionsNotSame");
    }

    const signData = {
      nonce: utils.randomBytes(32),
      collection: collections[0].toLowerCase(),
      tokenIds,
      amounts: dto.amounts,
      price: totalTokenPrice,
    };

    const signature = await Promise.resolve(this.getSign(signData));
    return { nonce: utils.hexlify(signData.nonce), signature };
  }

  public async getSign(data: Record<string, any>): Promise<string> {
    return this.signer._signTypedData(
      {
        name: "ERC1155Marketplace",
        version: "1.0.0",
        chainId: ~~this.configService.get<string>("CHAIN_ID", "1337"),
        verifyingContract: this.configService.get<string>("ERC1155_MARKETPLACE_ADDR", ""),
      },
      prepareEip712(data),
      data,
    );
  }
}
