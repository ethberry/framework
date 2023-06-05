import { Contract, Signer, constants } from "ethers";
import { templateId } from "../../constants";
import { amount } from "@gemunion/contracts-constants";

export async function customMintCommonERC721(contractInstance: Contract, signer: Signer, receiver: string) {
  return contractInstance.connect(signer).mintCommon(receiver, templateId) as Promise<any>;
}

export async function customMintBoxERC721(contractInstance: Contract, signer: Signer, receiver: string) {
  const items = [
    {
      tokenType: 0,
      token: constants.AddressZero,
      tokenId: 0,
      amount,
    },
  ];
  return contractInstance.connect(signer).mintBox(receiver, templateId, items, { value: amount }) as Promise<any>;
}
