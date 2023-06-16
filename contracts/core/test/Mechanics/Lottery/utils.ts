import { Network, Signer } from "ethers";

import { tokenName } from "@gemunion/contracts-constants";

export const wrapSignature = (network: Network, contract: any, account: Signer) => {
  return async (values: Record<string, any>) => {
    return account.signTypedData(
      // Domain
      {
        name: tokenName,
        version: "1.0.0",
        chainId: network.chainId,
        verifyingContract: await contract.getAddress(),
      },
      // Types
      {
        EIP712: [
          { name: "account", type: "address" },
          { name: "params", type: "Params" },
          { name: "numbers", type: "bool[36]" },
          { name: "price", type: "Asset" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "externalId", type: "uint256" },
          { name: "expiresAt", type: "uint256" },
          { name: "referrer", type: "address" },
          { name: "extra", type: "bytes32" },
        ],
        Asset: [
          { name: "tokenType", type: "uint256" },
          { name: "token", type: "address" },
          { name: "tokenId", type: "uint256" },
          { name: "amount", type: "uint256" },
        ],
      },
      // Value
      values,
    );
  };
};

export const wrapRaffleSignature = (network: Network, contract: Contract, account: SignerWithAddress) => {
  return (values: Record<string, any>) => {
    return account._signTypedData(
      // Domain
      {
        name: tokenName,
        version: "1.0.0",
        chainId: network.chainId,
        verifyingContract: contract.address,
      },
      // Types
      {
        EIP712: [
          { name: "account", type: "address" },
          { name: "params", type: "Params" },
          { name: "price", type: "Asset" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "externalId", type: "uint256" },
          { name: "expiresAt", type: "uint256" },
          { name: "referrer", type: "address" },
          { name: "extra", type: "bytes32" },
        ],
        Asset: [
          { name: "tokenType", type: "uint256" },
          { name: "token", type: "address" },
          { name: "tokenId", type: "uint256" },
          { name: "amount", type: "uint256" },
        ],
      },
      // Value
      values,
    );
  };
};
