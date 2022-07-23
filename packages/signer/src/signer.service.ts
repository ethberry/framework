import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";

import { IAsset } from "./interfaces";

@Injectable()
export class SignerService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
  ) {}

  public async getOneToManySignature(
    nonce: Uint8Array,
    account: string,
    externalId: number,
    expiresAt: number,
    item: IAsset,
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
          { name: "params", type: "Params" },
          { name: "item", type: "Asset" },
          { name: "ingredients", type: "Asset[]" },
        ],
        Params: [
          { name: "externalId", type: "uint256" },
          { name: "expiresAt", type: "uint256" },
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
        params: {
          externalId,
          expiresAt,
        },
        item,
        ingredients,
      },
    );
  }

  public async getManyToManySignature(
    nonce: Uint8Array,
    account: string,
    externalId: number,
    expiresAt: number,
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
          { name: "params", type: "Params" },
          { name: "items", type: "Asset[]" },
          { name: "ingredients", type: "Asset[]" },
        ],
        Params: [
          { name: "externalId", type: "uint256" },
          { name: "expiresAt", type: "uint256" },
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
        params: {
          externalId,
          expiresAt,
        },
        items,
        ingredients,
      },
    );
  }
}
