import { Contract, Signer, constants } from "ethers";
import { amount } from "@gemunion/contracts-constants";
import { templateId } from "../../../../constants";

export const customMint = (contractInstance: Contract, signer: Signer, receiver: string) => {
  return contractInstance.connect(signer).mintBox(receiver, templateId, [
    {
      tokenType: 0,
      token: constants.AddressZero,
      tokenId: templateId,
      amount,
    },
  ]) as Promise<any>;
};
