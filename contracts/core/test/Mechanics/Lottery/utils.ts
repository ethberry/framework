import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Network } from "@ethersproject/networks";
import { Contract } from "ethers";

import { tokenName } from "../../constants";

export const wrapSignature = (network: Network, contract: Contract, account: SignerWithAddress) => {
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
