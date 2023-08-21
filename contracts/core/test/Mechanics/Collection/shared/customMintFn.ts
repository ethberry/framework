import { Signer } from "ethers";

import { batchSize } from "@gemunion/contracts-constants";

import { tokenId } from "../../../constants";

export function customMintConsecutive(defaultBatchSize = batchSize) {
  return (contractInstance: any, signer: Signer, receiver: string) => {
    return contractInstance.connect(signer).mintConsecutive(receiver, defaultBatchSize + tokenId) as Promise<any>;
  };
}
