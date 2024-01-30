import { type IContract, ModuleType, TokenType } from "@framework/types";

export enum ContractHierarchyERC20EventType {
  Approval = "Approval",
  Transfer = "Transfer",
}

export enum ContractHierarchyERC721EventType {
  ApprovalForAll = "ApprovalForAll",
  DefaultRoyaltyInfo = "DefaultRoyaltyInfo",
  MintRandom = "MintRandom",
  TokenRoyaltyInfo = "TokenRoyaltyInfo",
  ConsecutiveTransfer = "ConsecutiveTransfer",
}

export const getHierarchyEventType = (contract: IContract): Record<string, string> => {
  const { contractType } = contract;

  switch (contractType) {
    case TokenType.ERC721:
      return ContractHierarchyERC721EventType;
    case TokenType.ERC20:
    default:
      return ContractHierarchyERC20EventType;
  }
};

export const getEventTypeByContractModule = (contract?: IContract): Record<string, string> => {
  if (!contract) {
    return {
      None: "None",
    };
  }

  const { contractModule } = contract;

  switch (contractModule) {
    case ModuleType.HIERARCHY:
    default:
      return getHierarchyEventType(contract);
  }
};
