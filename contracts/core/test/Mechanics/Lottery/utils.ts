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
          { name: "price", type: "uint256" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "externalId", type: "uint256" },
          { name: "expiresAt", type: "uint256" },
          { name: "referrer", type: "address" },
        ],
      },
      // Value
      values,
    );
  };
};
