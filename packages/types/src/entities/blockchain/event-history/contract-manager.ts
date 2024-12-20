import type { IAssetItem } from "./exchange/common";

export enum ContractManagerEventType {
  VestingDeployed = "VestingDeployed",
  ERC20TokenDeployed = "ERC20TokenDeployed",
  ERC721TokenDeployed = "ERC721TokenDeployed",
  ERC998TokenDeployed = "ERC998TokenDeployed",
  ERC1155TokenDeployed = "ERC1155TokenDeployed",
  MysteryBoxDeployed = "MysteryBoxDeployed",
  LootBoxDeployed = "LootBoxDeployed",
  CollectionDeployed = "CollectionDeployed",
  PaymentSplitterDeployed = "PaymentSplitterDeployed",
  PonziDeployed = "PonziDeployed",
  StakingDeployed = "StakingDeployed",
  LotteryDeployed = "LotteryDeployed",
  RaffleDeployed = "RaffleDeployed",
  WaitListDeployed = "WaitListDeployed",
}

// struct CollectionArgs {
//   string name;
//   string symbol;
//   uint96 royalty;
//   string baseTokenURI;
//   uint96 batchSize;
//   string contractTemplate;
// }
export interface ICollectionDeployedEventArgs {
  name: string;
  symbol: string;
  royalty: string;
  baseTokenURI: string;
  batchSize: string;
  contractTemplate: string;
}

export interface IContractManagerCollectionDeployedEvent {
  account: string;
  externalId: number;
  args: ICollectionDeployedEventArgs;
}

// struct VestingArgs {
//   address account;
//   uint64 startTimestamp; // in sec
//   uint64 duration; // in sec
//   string contractTemplate;
// }

export interface IVestingDeployedEventArgs {
  owner: string;
  startTimestamp: string;
  cliffInMonth: number;
  monthlyRelease: number;
  contractTemplate: string;
}

export interface IContractManagerVestingDeployedEvent {
  account: string;
  externalId: number;
  args: IVestingDeployedEventArgs;
  items: Array<IAssetItem>;
}

// struct MysteryArgs {
//   string name;
//   string symbol;
//   uint96 royalty;
//   string baseTokenURI;
//   string contractTemplate;
// }
export interface IMysteryTokenDeployedEventArgs {
  name: string;
  symbol: string;
  royalty: string;
  baseTokenURI: string;
  contractTemplate: string;
}

export interface IContractManagerMysteryTokenDeployedEvent {
  account: string;
  externalId: number;
  args: IMysteryTokenDeployedEventArgs;
}

export interface ILootTokenDeployedEventArgs {
  name: string;
  symbol: string;
  royalty: string;
  baseTokenURI: string;
  contractTemplate: string;
}

export interface IContractManagerLootTokenDeployedEvent {
  account: string;
  externalId: number;
  args: ILootTokenDeployedEventArgs;
}

// struct Erc20Args {
//   string name;
//   string symbol;
//   uint256 cap;
//   string contractTemplate;
// }
export interface IERC20TokenDeployedEventArgs {
  name: string;
  symbol: string;
  cap: string;
  contractTemplate: string;
}
export interface IContractManagerERC20TokenDeployedEvent {
  account: string;
  externalId: number;
  args: IERC20TokenDeployedEventArgs;
}

// struct Erc721\998Args {
//   string name;
//   string symbol;
//   uint96 royalty;
//   string baseTokenURI;
//   string contractTemplate;
// }
export interface IERC721TokenDeployedEventArgs {
  name: string;
  symbol: string;
  royalty: string;
  baseTokenURI: string;
  contractTemplate: string;
}
export interface IContractManagerERC721TokenDeployedEvent {
  account: string;
  externalId: number;
  args: IERC721TokenDeployedEventArgs;
}

export interface IERC998TokenDeployedEventArgs {
  name: string;
  symbol: string;
  royalty: string;
  baseTokenURI: string;
  contractTemplate: string;
}
export interface IContractManagerERC998TokenDeployedEvent {
  account: string;
  externalId: number;
  args: IERC998TokenDeployedEventArgs;
}

// struct Erc1155Args {
//   uint96 royalty;
//   string baseTokenURI;
//   string contractTemplate;
// }
export interface IERC1155TokenDeployedEventArgs {
  royalty: string;
  baseTokenURI: string;
  contractTemplate: string;
}

export interface IContractManagerERC1155TokenDeployedEvent {
  account: string;
  externalId: number;
  args: IERC1155TokenDeployedEventArgs;
}

// struct PonziArgs {
//   address[] payees;
//   uint256[] shares;
//   string contractTemplate;
// }
export interface IPonziDeployedEventArgs {
  payees: Array<string>;
  shares: Array<string>;
  contractTemplate: string;
}

export interface IContractManagerPonziDeployedEvent {
  account: string;
  externalId: number;
  args: IPonziDeployedEventArgs;
}

// struct StakingArgs { string contractTemplate }
export interface IStakingDeployedEventArgs {
  contractTemplate: string;
}

export interface IContractManagerStakingDeployedEvent {
  account: string;
  externalId: number;
  args: IStakingDeployedEventArgs;
}

// struct LotteryConfig {
//   uint256 timeLagBeforeRelease;
//   uint256 commission;
// }

export interface ILotteryConfig {
  timeLagBeforeRelease: string;
  commission: string;
}

export interface ILotteryDeployedEventArgs {
  config: ILotteryConfig;
}

export interface IContractManagerLotteryDeployedEvent {
  account: string;
  externalId: number;
  args: ILotteryDeployedEventArgs;
}

export interface IRaffleConfig {
  timeLagBeforeRelease: string;
  commission: string;
}

export interface IRaffleDeployedEventArgs {
  config: IRaffleConfig;
}

export interface IContractManagerRaffleDeployedEvent {
  account: string;
  externalId: number;
}

export interface IContractManagerWaitListDeployedEvent {
  account: string;
  externalId: number;
}

export interface IPaymentSplitterDeployedEventArgs {
  payees: Array<string>;
  shares: Array<string>;
}

export interface IContractManagerPaymentSplitterDeployedEvent {
  account: string;
  externalId: number;
  args: IPaymentSplitterDeployedEventArgs;
}

export type TContractManagerEventData =
  | IContractManagerVestingDeployedEvent
  | IContractManagerERC20TokenDeployedEvent
  | IContractManagerERC721TokenDeployedEvent
  | IContractManagerERC998TokenDeployedEvent
  | IContractManagerERC1155TokenDeployedEvent
  | IContractManagerMysteryTokenDeployedEvent
  | IContractManagerCollectionDeployedEvent
  | IContractManagerStakingDeployedEvent
  | IContractManagerPaymentSplitterDeployedEvent
  | IContractManagerPonziDeployedEvent
  | IContractManagerLotteryDeployedEvent
  | IContractManagerRaffleDeployedEvent
  | IContractManagerWaitListDeployedEvent;
