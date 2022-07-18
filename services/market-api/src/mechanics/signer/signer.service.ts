import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";

export interface IAsset {
  tokenType: number;
  token: string;
  tokenId: string;
  amount: string;
}

@Injectable()
export class SignerService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
  ) {}

  public async getSignature(
    nonce: Uint8Array,
    account: string,
    items: Array<IAsset>,
    ingredients: Array<IAsset>,
  ): Promise<string> {
    return this.signer._signTypedData(
      // Domain
      {
        name: "Exchange",
        version: "1.0.0",
        chainId: ~~this.configService.get<string>("CHAIN_ID", "1337"),
        verifyingContract: this.configService.get<string>("EXCHANGE_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "nonce", type: "bytes32" },
          { name: "account", type: "address" },
          { name: "items", type: "Asset[]" },
          { name: "ingredients", type: "Asset[]" },
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
        items,
        ingredients,
      },
    );
  }
}
