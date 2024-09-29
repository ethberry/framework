import { Inject, Injectable } from "@nestjs/common";
import { Wallet } from "ethers";

import type { ISignatureAsset, ISignatureParams } from "@ethberry/types-blockchain";
import { ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";
import type { IContract } from "@framework/types";

@Injectable()
export class SignerService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
  ) {}

  public async getOneToOneSignature(
    verifyingContract: IContract,
    account: string,
    params: ISignatureParams,
    item: ISignatureAsset,
    price: ISignatureAsset,
  ): Promise<string> {
    return this.signer.signTypedData(
      // Domain
      {
        name: verifyingContract.name,
        version: "1.0.0",
        chainId: verifyingContract.chainId,
        verifyingContract: verifyingContract.address,
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
    verifyingContract: IContract,
    account: string,
    params: ISignatureParams,
    item: ISignatureAsset,
    price: Array<ISignatureAsset>,
  ): Promise<string> {
    return this.signer.signTypedData(
      // Domain
      {
        name: verifyingContract.name,
        version: "1.0.0",
        chainId: verifyingContract.chainId,
        verifyingContract: verifyingContract.address,
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
    verifyingContract: IContract,
    account: string,
    params: ISignatureParams,
    items: Array<ISignatureAsset>,
    price: Array<ISignatureAsset>,
  ): Promise<string> {
    return this.signer.signTypedData(
      // Domain
      {
        name: verifyingContract.name,
        version: "1.0.0",
        chainId: verifyingContract.chainId,
        verifyingContract: verifyingContract.address,
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

  public async getOneToManyToManySignature(
    verifyingContract: IContract,
    account: string,
    params: ISignatureParams,
    item: ISignatureAsset,
    price: Array<ISignatureAsset>,
    content: Array<ISignatureAsset>,
    config: string,
  ): Promise<string> {
    return this.signer.signTypedData(
      // Domain
      {
        name: verifyingContract.name,
        version: "1.0.0",
        chainId: verifyingContract.chainId,
        verifyingContract: verifyingContract.address,
      },
      // Types
      {
        EIP712: [
          { name: "account", type: "address" },
          { name: "params", type: "Params" },
          { name: "item", type: "Asset" },
          { name: "price", type: "Asset[]" },
          { name: "content", type: "Asset[]" },
          { name: "config", type: "bytes32" },
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
        content,
        config,
      },
    );
  }
}
