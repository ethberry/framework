import { Signer } from "ethers";

import { batchSize } from "@gemunion/contracts-constants";

import { tokenId } from "../../../constants";

export async function customMintConsecutive(contractInstance: any, signer: Signer, receiver: string) {
  return contractInstance.connect(signer).mintConsecutive(receiver, batchSize + tokenId) as Promise<any>;
}
