import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nest-js-module-ethers-gcp";
import { testChainId } from "@gemunion/contracts-constants";

import { IAsset, IParams } from "./interfaces";

@Injectable()
export class SignerService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
  ) {}

  public async getOneToOneSignature(account: string, params: IParams, item: IAsset, price: IAsset): Promise<string> {
    return this.signer.signTypedData(
      // Domain
      {
        name: "Exchange",
        version: "1.0.0",
        chainId: ~~this.configService.get<number>("CHAIN_ID", testChainId),
        verifyingContract: this.configService.get<string>("EXCHANGE_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "account", type: "address" },
          { name: "params", type: "Params" },
          { name: "item", type: "Asset" },
          { name: "price", type: "Asset" },
        ],
        Params: [
          { name: "externalId", type: "uint256" },
          { name: "expiresAt", type: "uint256" },
          { name: "nonce", type: "bytes32" },
          { name: "extra", type: "bytes32" },
          { name: "receiver", type: "address" },
          { name: "referrer", type: "address" },
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
        account,
        params,
        item,
        price,
      },
    );
  }

  public async getOneToManySignature(
    account: string,
    params: IParams,
    item: IAsset,
    price: Array<IAsset>,
  ): Promise<string> {
    return this.signer.signTypedData(
      // Domain
      {
        name: "Exchange",
        version: "1.0.0",
        chainId: ~~this.configService.get<number>("CHAIN_ID", testChainId),
        verifyingContract: this.configService.get<string>("EXCHANGE_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "account", type: "address" },
          { name: "params", type: "Params" },
          { name: "item", type: "Asset" },
          { name: "price", type: "Asset[]" },
        ],
        Params: [
          { name: "externalId", type: "uint256" },
          { name: "expiresAt", type: "uint256" },
          { name: "nonce", type: "bytes32" },
          { name: "extra", type: "bytes32" },
          { name: "receiver", type: "address" },
          { name: "referrer", type: "address" },
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
        account,
        params,
        item,
        price,
      },
    );
  }

  public async getManyToManySignature(
    account: string,
    params: IParams,
    items: Array<IAsset>,
    price: Array<IAsset>,
  ): Promise<string> {
    return this.signer.signTypedData(
      // Domain
      {
        name: "Exchange",
        version: "1.0.0",
        chainId: ~~this.configService.get<number>("CHAIN_ID", testChainId),
        verifyingContract: this.configService.get<string>("EXCHANGE_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "account", type: "address" },
          { name: "params", type: "Params" },
          { name: "items", type: "Asset[]" },
          { name: "price", type: "Asset[]" },
        ],
        Params: [
          { name: "externalId", type: "uint256" },
          { name: "expiresAt", type: "uint256" },
          { name: "nonce", type: "bytes32" },
          { name: "extra", type: "bytes32" },
          { name: "receiver", type: "address" },
          { name: "referrer", type: "address" },
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
        account,
        params,
        items,
        price,
      },
    );
  }
}
