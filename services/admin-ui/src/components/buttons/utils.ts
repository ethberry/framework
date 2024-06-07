import type { IContract } from "@framework/types";
import { ContractFeatures, ContractStatus, TokenType } from "@framework/types";

export const shouldDisableByContractType = (contract: IContract): boolean => {
  const { contractFeatures, contractStatus, contractType } = contract;

  if (contractType === TokenType.NATIVE) {
    return true;
  }

  if (contractFeatures.includes(ContractFeatures.EXTERNAL)) {
    return true;
  }

  return contractStatus === ContractStatus.INACTIVE;
};
