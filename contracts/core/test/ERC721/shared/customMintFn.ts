import { Signer, ZeroAddress } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import { templateId } from "../../constants";

export async function customMintCommonERC721(contractInstance: any, signer: Signer, receiver: string) {
  return contractInstance.connect(signer).mintCommon(receiver, templateId) as Promise<any>;
}

export async function customMintBoxERC721(contractInstance: any, signer: Signer, receiver: string) {
  const items = [
    {
      tokenType: 0,
      token: ZeroAddress,
      tokenId: 0,
      amount,
    },
  ];
  return contractInstance.connect(signer).mintBox(receiver, templateId, items, { value: amount }) as Promise<any>;
}
