import { IContractManagerCollectionDeployedEvent } from "./collection";
import { IContractManagerERC20TokenDeployedEvent } from "./erc20";
import { IContractManagerERC721TokenDeployedEvent } from "./erc721";
import { IContractManagerERC998TokenDeployedEvent } from "./erc998";
import { IContractManagerERC1155TokenDeployedEvent } from "./erc1155";
import { IContractManagerLegacyVestingDeployedEvent } from "./legacy-vesting";
import { IContractManagerLootTokenDeployedEvent } from "./loot";
import { IContractManagerLotteryDeployedEvent } from "./lottery";
import { IContractManagerMysteryTokenDeployedEvent } from "./mystery";
import { IContractManagerPaymentSplitterDeployedEvent } from "./payment-splitter";
import { IContractManagerPonziDeployedEvent } from "./ponzi";
import { IContractManagerRaffleDeployedEvent } from "./raffle";
import { IContractManagerStakingDeployedEvent } from "./staking";
import { IContractManagerVestingTokenDeployedEvent } from "./vesting";
import { IContractManagerWaitListDeployedEvent } from "./wait-list";

export { IContractManagerCommonDeployedEvent } from "./common";

export enum ContractManagerEventType {
  LegacyVestingDeployed = "LegacyVestingDeployed",
  VestingBoxDeployed = "VestingBoxDeployed",
  ERC20TokenDeployed = "ERC20TokenDeployed",
  ERC721TokenDeployed = "ERC721TokenDeployed",
  ERC998TokenDeployed = "ERC998TokenDeployed",
  ERC1155TokenDeployed = "ERC1155TokenDeployed",
  LootBoxDeployed = "LootBoxDeployed",
  MysteryBoxDeployed = "MysteryBoxDeployed",
  CollectionDeployed = "CollectionDeployed",
  PaymentSplitterDeployed = "PaymentSplitterDeployed",
  PonziDeployed = "PonziDeployed",
  StakingDeployed = "StakingDeployed",
  LotteryDeployed = "LotteryDeployed",
  RaffleDeployed = "RaffleDeployed",
  WaitListDeployed = "WaitListDeployed",
}

export enum ContractManagerEventSignature {
  LegacyVestingDeployed = "LegacyVestingDeployed(address,uint256,(address,uint64,uint16,uint16,string))",
  VestingBoxDeployed = "VestingBoxDeployed(address,uint256,(string,string,uint96,string,string))",
  ERC20TokenDeployed = "ERC20TokenDeployed(address,uint256,(string,string,uint256,string))",
  ERC721TokenDeployed = "ERC721TokenDeployed(address,uint256,(string,string,uint96,string,string))",
  ERC998TokenDeployed = "ERC998TokenDeployed(address,uint256,(string,string,uint96,string,string))",
  ERC1155TokenDeployed = "ERC1155TokenDeployed(address,uint256,(uint96,string,string))",
  LootBoxDeployed = "LootBoxDeployed(address,uint256,(string,string,uint96,string,string))",
  MysteryBoxDeployed = "MysteryBoxDeployed(address,uint256,(string,string,uint96,string,string))",
  CollectionDeployed = "CollectionDeployed(address,uint256,(string,string,uint96,string,uint96,string))",
  PaymentSplitterDeployed = "PaymentSplitterDeployed(address,uint256,(address[],uint256[]))",
  PonziDeployed = "PonziDeployed(address,uint256,(address[],uint256[],string))",
  StakingDeployed = "StakingDeployed(address,uint256,(string))",
  LotteryDeployed = "LotteryDeployed(address,uint256,((uint256,uint256)))",
  RaffleDeployed = "RaffleDeployed(address,uint256)",
  WaitListDeployed = "WaitListDeployed(address,uint256)",
}

export type TContractManagerEvent =
  | IContractManagerLegacyVestingDeployedEvent
  | IContractManagerVestingTokenDeployedEvent
  | IContractManagerERC20TokenDeployedEvent
  | IContractManagerERC721TokenDeployedEvent
  | IContractManagerERC1155TokenDeployedEvent
  | IContractManagerMysteryTokenDeployedEvent
  | IContractManagerLootTokenDeployedEvent
  | IContractManagerCollectionDeployedEvent
  | IContractManagerStakingDeployedEvent
  | IContractManagerPaymentSplitterDeployedEvent
  | IContractManagerPonziDeployedEvent
  | IContractManagerLotteryDeployedEvent
  | IContractManagerRaffleDeployedEvent
  | IContractManagerWaitListDeployedEvent;

export {
  IContractManagerLegacyVestingDeployedEvent,
  IContractManagerVestingTokenDeployedEvent,
  IContractManagerERC20TokenDeployedEvent,
  IContractManagerERC721TokenDeployedEvent,
  IContractManagerERC998TokenDeployedEvent,
  IContractManagerERC1155TokenDeployedEvent,
  IContractManagerMysteryTokenDeployedEvent,
  IContractManagerLootTokenDeployedEvent,
  IContractManagerCollectionDeployedEvent,
  IContractManagerStakingDeployedEvent,
  IContractManagerPaymentSplitterDeployedEvent,
  IContractManagerPonziDeployedEvent,
  IContractManagerLotteryDeployedEvent,
  IContractManagerRaffleDeployedEvent,
  IContractManagerWaitListDeployedEvent,
};
