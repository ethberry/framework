import { Contract, Signer } from "ethers";
import { templateId } from "../../constants";

export async function customMintCommonERC721(contractInstance: Contract, signer: Signer, receiver: string) {
  return contractInstance.connect(signer).mintCommon(receiver, templateId) as Promise<any>;
}
