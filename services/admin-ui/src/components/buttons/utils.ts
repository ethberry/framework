import { ContractFeatures, ContractStatus, TokenType } from "@framework/types";
import type { IContract } from "@framework/types";

export const shouldDisableByContractType = (contract: IContract): boolean => {
  const { contractFeatures, contractStatus, contractType } = contract;

  if (contractType === TokenType.ERC20 || contractType === TokenType.ERC721 || contractType === TokenType.ERC1155) {
    return contractStatus === ContractStatus.INACTIVE || contractFeatures.includes(ContractFeatures.EXTERNAL);
  }

  return contractStatus === ContractStatus.INACTIVE;
};
