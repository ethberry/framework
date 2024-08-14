import { ContractFeatures, type IContract, ModuleType, TokenType } from "@framework/types";

export enum ContractHierarchyERC20EventType {
  Approval = "Approval",
  Transfer = "Transfer",
  Blacklisted = "Blacklisted",
  UnBlacklisted = "UnBlacklisted",
  Whitelisted = "Whitelisted",
  UnWhitelisted = "UnWhitelisted",
  RoleGranted = "RoleGranted",
  RoleRevoked = "RoleRevoked",
}

export enum ContractHierarchyERC1155EventType {
  TransferSingle = "TransferSingle",
  TransferBatch = "TransferBatch",
  ApprovalForAll = "ApprovalForAll",
  URI = "URI",
}

export enum ContractHierarchyERC721EventType {
  Approval = "Approval",
  LevelUp = "LevelUp",
  Blacklisted = "Blacklisted",
  UnBlacklisted = "UnBlacklisted",
  Transfer = "Transfer",
}

export enum ContractHierarchyERC721RandomEventType {
  MintRandom = "MintRandom",
  Approval = "Approval",
  LevelUp = "LevelUp",
  Blacklisted = "Blacklisted",
  UnBlacklisted = "UnBlacklisted",
  Transfer = "Transfer",
}

export enum ContractHierarchyERC998EventType {
  Approval = "Approval",
  Blacklisted = "Blacklisted",
  LevelUp = "LevelUp",
  ReceivedChild = "ReceivedChild",
  Transfer = "Transfer",
  TransferChild = "TransferChild",
  UnBlacklisted = "UnBlacklisted",
  UnWhitelistedChild = "UnWhitelistedChild",
  WhitelistedChild = "WhitelistedChild",
}

export enum ContractHierarchyERC998RandomEventType {
  Approval = "Approval",
  Blacklisted = "Blacklisted",
  LevelUp = "LevelUp",
  MintRandom = "MintRandom",
  ReceivedChild = "ReceivedChild",
  Transfer = "Transfer",
  TransferChild = "TransferChild",
  UnBlacklisted = "UnBlacklisted",
  UnWhitelistedChild = "UnWhitelistedChild",
  WhitelistedChild = "WhitelistedChild",
}

// EXCHANGE ACHIEVEMENT EVENTS
export enum ContractExchangeEventType {
  Breed = "Breed",
  Claim = "Claim",
  Craft = "Craft",
  Dismantle = "Dismantle",
  Lend = "Lend",
  Merge = "Merge",
  Purchase = "Purchase",
  PurchaseLottery = "PurchaseLottery",
  PurchaseMysteryBox = "PurchaseMysteryBox",
  PurchaseRaffle = "PurchaseRaffle",
  ReferralEvent = "ReferralEvent",
  Upgrade = "Upgrade",
}

// CM ACHIEVEMENT EVENTS
export enum ContractManagerEventType {
  CollectionDeployed = "CollectionDeployed",
  ERC1155TokenDeployed = "ERC1155TokenDeployed",
  ERC20TokenDeployed = "ERC20TokenDeployed",
  ERC721TokenDeployed = "ERC721TokenDeployed",
  ERC998TokenDeployed = "ERC998TokenDeployed",
  LotteryDeployed = "LotteryDeployed",
  MysteryBoxDeployed = "MysteryBoxDeployed",
  PaymentSplitterDeployed = "PaymentSplitterDeployed",
  PonziDeployed = "PonziDeployed",
  RaffleDeployed = "RaffleDeployed",
  StakingDeployed = "StakingDeployed",
  VestingDeployed = "VestingDeployed",
  WaitListDeployed = "WaitListDeployed",
}

// STAKING ACHIEVEMENT EVENTS
export enum ContractStakingEventType {
  RuleCreated = "RuleCreated",
  RuleUpdated = "RuleUpdated",
  DepositStart = "DepositStart",
  DepositWithdraw = "DepositWithdraw",
  DepositFinish = "DepositFinish",
  DepositReturn = "DepositReturn",
  DepositPenalty = "DepositPenalty",
}

export enum ContractMysteryBoxEventType {
  UnpackMysteryBox = "UnpackMysteryBox",
}

export enum ContractWrapperEventType {
  UnpackWrapper = "UnpackWrapper",
}

export enum ContractLotteryEventType {
  RoundStarted = "RoundStarted",
  RoundEnded = "RoundEnded",
  RoundFinalized = "RoundFinalized",
  Prize = "Prize",
  Released = "Released",
  PaymentReceived = "PaymentReceived",
}

export const getLotteryEventType = (contract: IContract): Record<string, string> => {
  const { contractType, contractFeatures } = contract;

  switch (contractType) {
    case TokenType.ERC721:
      switch (contractFeatures.includes(ContractFeatures.RANDOM) || contractFeatures.includes(ContractFeatures.GENES)) {
        case true:
          return ContractHierarchyERC721RandomEventType;
        default:
          return ContractHierarchyERC721EventType;
      }
    default:
      return ContractLotteryEventType;
  }
};

export const getHierarchyEventType = (contract: IContract): Record<string, string> => {
  const { contractType, contractFeatures } = contract;

  switch (contractType) {
    case TokenType.ERC721:
      switch (contractFeatures.includes(ContractFeatures.RANDOM) || contractFeatures.includes(ContractFeatures.GENES)) {
        case true:
          return ContractHierarchyERC721RandomEventType;
        default:
          return ContractHierarchyERC721EventType;
      }
    case TokenType.ERC998:
      switch (contractFeatures.includes(ContractFeatures.RANDOM) || contractFeatures.includes(ContractFeatures.GENES)) {
        case true:
          return ContractHierarchyERC998RandomEventType;
        default:
          return ContractHierarchyERC998EventType;
      }
    case TokenType.ERC20:
      return ContractHierarchyERC20EventType;
    case TokenType.ERC1155:
      return ContractHierarchyERC1155EventType;
    case TokenType.NATIVE:
    default:
      return {};
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
      return getHierarchyEventType(contract);
    case ModuleType.EXCHANGE:
      return ContractExchangeEventType;
    case ModuleType.CONTRACT_MANAGER:
      return ContractManagerEventType;
    case ModuleType.STAKING:
      return ContractStakingEventType;
    case ModuleType.MYSTERY:
      return ContractMysteryBoxEventType;
    case ModuleType.RAFFLE:
      return getLotteryEventType(contract);
    case ModuleType.LOTTERY:
      return getLotteryEventType(contract);
    case ModuleType.PONZI:
      return ContractStakingEventType;
    case ModuleType.WRAPPER:
      return ContractWrapperEventType;
    default: {
      // throw new Error("wrong contract");
      return {};
    }
  }
};
