import type { IDeployable } from "@gemunion/types-blockchain";

import type { IAssetComponentHistory } from "../exchange/asset-component-history";
import type { IToken } from "../hierarchy/token";
import type { IContract } from "../hierarchy/contract";

import type { TExchangeEvents } from "./exchange/exchange";
import type { TReferralEventData } from "./exchange/referral";

import type { TAccessControlEvents } from "./extensions/access-control";
import type { TAccessListEvents } from "./extensions/access-list";
import type { TPausableEvents } from "./extensions/pausable";
import type { TRoyaltyEvents } from "./extensions/royalty";

import type { TErc20Events } from "./hierarchy/erc20";
import type { TErc721Events } from "./hierarchy/erc721";
import type { TErc1155Events } from "./hierarchy/erc1155";
import type { TErc998Events } from "./hierarchy/erc998";
import type { TErc1363Events } from "./hierarchy/erc1363";

import type { TChainLinkEvents } from "./integrations/chain-link";

import type { TVestingEvents } from "./mechanics/vesting";
import type { TContractManagerEventData } from "./contract-manager";
import type { TStakingEvents } from "./mechanics/staking";
import type { TLotteryEvents } from "./mechanics/lottery";
import type { TPonziEvents } from "./mechanics/ponzi";
import type { TMysteryEvents } from "./mechanics/mystery";
import type { TWrapperEvents } from "./mechanics/wrapper";
import type { TErc4907Events } from "./extensions/erc4907";
import type { TUpgradeEvents } from "./mechanics/grade";
import type { TRaffleEvents } from "./mechanics/raffle";
import type { TWaitListEvents } from "./mechanics/waitlist";

export enum ContractEventType {
  // MODULE:ERC20
  Snapshot = "Snapshot",
  Approval = "Approval",
  Transfer = "Transfer",

  // MODULE:ERC721
  ApprovalForAll = "ApprovalForAll",
  DefaultRoyaltyInfo = "DefaultRoyaltyInfo",
  MintRandom = "MintRandom",
  TokenRoyaltyInfo = "TokenRoyaltyInfo",
  ConsecutiveTransfer = "ConsecutiveTransfer",
  // Approval = "Approval",
  // Transfer = "Transfer",

  // MODULE:ERC998
  BatchReceivedChild = "BatchReceivedChild",
  BatchTransferChild = "BatchTransferChild",
  WhitelistedChild = "WhitelistedChild",
  UnWhitelistedChild = "UnWhitelistedChild",
  ReceivedChild = "ReceivedChild",
  TransferChild = "TransferChild",
  SetMaxChild = "SetMaxChild",

  // MODULE:ERC1155
  TransferBatch = "TransferBatch",
  TransferSingle = "TransferSingle",
  URI = "URI",

  // MODULE:CLAIM
  RedeemClaim = "RedeemClaim",
  UnpackClaim = "UnpackClaim",

  // MODULE:LOTTERY
  RoundFinalized = "RoundFinalized",
  RoundStarted = "RoundStarted",
  RoundEnded = "RoundEnded",
  PurchaseLottery = "PurchaseLottery",
  PurchaseRaffle = "PurchaseRaffle",
  Released = "Released",
  Prize = "Prize",

  // MODULE:WRAPPER
  UnpackWrapper = "UnpackWrapper",

  // MODULE:MYSTERY
  UnpackMysteryBox = "UnpackMysteryBox",

  // MODULE:PAUSE
  Paused = "Paused",
  Unpaused = "Unpaused",

  // MODULE:VESTING
  EtherReleased = "EtherReleased",
  ERC20Released = "ERC20Released",
  EtherReceived = "EtherReceived",

  // MODULE:ACCESS_LIST
  Blacklisted = "Blacklisted",
  UnBlacklisted = "UnBlacklisted",
  Whitelisted = "Whitelisted",
  UnWhitelisted = "UnWhitelisted",

  // MODULE:ACCESS_CONTROL
  RoleGranted = "RoleGranted",
  RoleRevoked = "RoleRevoked",
  RoleAdminChanged = "RoleAdminChanged",
  DefaultAdminTransferScheduled = "DefaultAdminTransferScheduled",
  DefaultAdminTransferCanceled = "DefaultAdminTransferCanceled",
  DefaultAdminDelayChangeScheduled = "DefaultAdminDelayChangeScheduled",
  DefaultAdminDelayChangeCanceled = "DefaultAdminDelayChangeCanceled",
  OwnershipTransferred = "OwnershipTransferred",
  OwnershipTransferStarted = "OwnershipTransferStarted",

  // MODULE:STAKING
  RuleCreated = "RuleCreated",
  RuleUpdated = "RuleUpdated",
  StakingStart = "StakingStart",
  StakingWithdraw = "StakingWithdraw",
  StakingFinish = "StakingFinish",
  WithdrawBalance = "WithdrawBalance",
  ReturnDeposit = "ReturnDeposit",

  // MODULE:EXCHANGE
  // MODULE:CORE
  Purchase = "Purchase",
  // MODULE:CLAIM
  Claim = "Claim",
  // MODULE:CRAFT
  Craft = "Craft",
  Dismantle = "Dismantle",
  Merge = "Merge",
  // MODULE:RENTABLE
  UpdateUser = "UpdateUser",
  Lend = "Lend",
  // MODULE:MYSTERY
  PurchaseMysteryBox = "PurchaseMysteryBox",
  // MODULE:GRADE
  Upgrade = "Upgrade",
  // MODULE:WAITLIST
  WaitListRewardSet = "WaitListRewardSet",
  WaitListRewardClaimed = "WaitListRewardClaimed",
  // MODULE:BREEDING
  Breed = "Breed",
  // MODULE:GRADE
  LevelUp = "LevelUp",
  MetadataUpdate = "MetadataUpdate",
  BatchMetadataUpdate = "BatchMetadataUpdate",
  // MODULE:PAYMENT_SPLITTER
  PayeeAdded = "PayeeAdded",
  PaymentReleased = "PaymentReleased",
  ERC20PaymentReleased = "ERC20PaymentReleased",
  PaymentReceived = "PaymentReceived",
  PaymentEthReceived = "PaymentEthReceived",
  PaymentEthSent = "PaymentEthSent",

  // MODULE:CHAINLINK
  RandomnessRequest = "RandomnessRequest",
  RandomnessRequestId = "RandomnessRequestId",
  SubscriptionCreated = "SubscriptionCreated",

  // MODULE:CHAINLINKV2
  RandomWordsRequested = "RandomWordsRequested",
  VrfSubscriptionSet = "VrfSubscriptionSet",
  SubscriptionConsumerAdded = "SubscriptionConsumerAdded",

  // MODULE:ECOMMERCE
  EcommercePurchase = "EcommercePurchase",
}

export enum ContractEventSignature {
  // MODULE:ERC20
  Snapshot = "Snapshot(uint256)",
  Approval = "Approval(address,address,uint256)",
  Transfer = "Transfer(address,address,uint256)",

  // MODULE:ERC721
  ApprovalForAll = "ApprovalForAll(address,address,bool)",
  DefaultRoyaltyInfo = "DefaultRoyaltyInfo(address,uint96)",
  MintRandom = "MintRandom(uint256,address,uint256[],uint256,uint256)",

  TokenRoyaltyInfo = "TokenRoyaltyInfo(uint256,address,uint96)",
  ConsecutiveTransfer = "ConsecutiveTransfer(uint256,uint256,address,address)",
  // Approval = "Approval",
  // Transfer = "Transfer",

  // MODULE:ERC998
  BatchReceivedChild = "BatchReceivedChild(address,uint256,address,uint256[],uint256[])",
  BatchTransferChild = "BatchTransferChild(uint256,address,address,uint256[],uint256[])",
  WhitelistedChild = "WhitelistedChild(address,uint256)",
  UnWhitelistedChild = "UnWhitelistedChild(address)",
  ReceivedChild = "ReceivedChild(address,uint256,address,uint256,uint256)",
  TransferChild = "TransferChild(uint256,address,address,uint256,uint256)",
  SetMaxChild = "SetMaxChild(address,uint256)",

  // MODULE:ERC1155
  TransferBatch = "TransferBatch(address,address,address,uint256[],uint256[])",
  TransferSingle = "TransferSingle(address,address,address,uint256,uint256)",
  URI = "URI(string,uint256)",

  // MODULE:CLAIM
  // TODO REMOVE?
  RedeemClaim = "RedeemClaim()",
  UnpackClaim = "UnpackClaim()",

  // MODULE:LOTTERY
  RoundFinalized = "RoundFinalized(uint256,uint8[6])",
  // event RoundStarted(uint256 roundId, uint256 startTimestamp, uint256 maxTicket, Asset ticket, Asset price);
  RoundStarted = "RoundStarted(uint256,uint256,uint256,(uint8,address,uint256,uint256),(uint8,address,uint256,uint256))",
  RoundEnded = "RoundEnded(uint256,uint256)",
  // event PurchaseLottery(address account, uint256 externalId, Asset item, Asset price, uint256 roundId, bytes32 numbers);
  PurchaseLottery = "PurchaseLottery(address,uint256,(uint8,address,uint256,uint256),(uint8,address,uint256,uint256),uint256,bytes32)",
  // event PurchaseRaffle(address account, uint256 externalId, Asset item, Asset price, uint256 roundId, uint256 index);
  PurchaseRaffle = "PurchaseRaffle(address,uint256,(uint8,address,uint256,uint256),(uint8,address,uint256,uint256),uint256,uint256)",
  Released = "Released(uint256,uint256)",
  Prize = "Prize(address,uint256,uint256,uint256)",

  // MODULE:WRAPPER
  UnpackWrapper = "UnpackWrapper(uint256)",

  // MODULE:MYSTERY
  UnpackMysteryBox = "UnpackMysteryBox(address,uint256)",

  // MODULE:PAUSE
  Paused = "Paused(address)",
  Unpaused = "Unpaused(address)",

  // MODULE:VESTING
  EtherReleased = "EtherReleased(uint256)",
  ERC20Released = "ERC20Released(address,uint256)",
  // TODO remove
  EtherReceived = "EtherReceived()",

  // MODULE:ACCESS_LIST
  Blacklisted = "Blacklisted(address)",
  UnBlacklisted = "UnBlacklisted(address)",
  Whitelisted = "Whitelisted(address)",
  UnWhitelisted = "UnWhitelisted(address)",

  // MODULE:ACCESS_CONTROL
  RoleGranted = "RoleGranted(bytes32,address,address)",
  RoleRevoked = "RoleRevoked(bytes32,address,address)",
  RoleAdminChanged = "RoleAdminChanged(bytes32,bytes32,bytes32)",
  DefaultAdminTransferScheduled = "DefaultAdminTransferScheduled(address,uint48)",
  DefaultAdminTransferCanceled = "DefaultAdminTransferCanceled()",
  DefaultAdminDelayChangeScheduled = "DefaultAdminDelayChangeScheduled(uint48,uint48)",
  DefaultAdminDelayChangeCanceled = "DefaultAdminDelayChangeCanceled()",
  OwnershipTransferred = "OwnershipTransferred(address,address)",
  OwnershipTransferStarted = "OwnershipTransferStarted(address,address)",

  // MODULE:STAKING
  // event RuleCreated(uint256 ruleId, Rule rule, uint256 externalId);
  RuleCreated = "RuleCreated(uint256,((uint8,address,uint256,uint256)[],(uint8,address,uint256,uint256)[],(uint8,address,uint256,uint256)[][],uint256,uint256,uint256,bool,bool),uint256)",
  RuleUpdated = "RuleUpdated(uint256,bool)",
  StakingStart = "StakingStart(uint256,uint256,address,uint256,uint256)",
  StakingWithdraw = "StakingWithdraw(uint256,address,uint256)",
  StakingFinish = "StakingFinish(uint256,address,uint256,uint256)",
  BalanceWithdraw = "BalanceWithdraw(address,(uint8,address,uint256,uint256))",
  DepositReturn = "DepositReturn(uint256,address)",
  DepositStart = "DepositStart(uint256,uint256,address,uint256,uint256[])",
  DepositWithdraw = "DepositWithdraw(uint256,address,uint256)",
  DepositFinish = "DepositFinish(uint256,address,uint256,uint256)",

  // MODULE:EXCHANGE
  // MODULE:CORE
  // event Purchase(address account, uint256 externalId, Asset item, Asset[] price);
  Purchase = "Purchase(address,uint256,(uint8,address,uint256,uint256),(uint8,address,uint256,uint256)[])",
  // MODULE:CLAIM
  // event Claim(address account, uint256 externalId, Asset[] items);
  Claim = "Claim(address,uint256,(uint8,address,uint256,uint256)[])",
  // MODULE:CRAFT
  // event Craft(address from, uint256 externalId, Asset[] items, Asset[] price);
  Craft = "Craft(address,uint256,(uint8,address,uint256,uint256)[],(uint8,address,uint256,uint256)[])",
  // MODULE:RENTABLE
  UpdateUser = "UpdateUser(uint256,address,uint64)",
  // event Lend(address from, address to, uint64 expires, uint256 externalId, Asset item, Asset[] price);
  // event LendMany(address from, address to, uint64 expires, uint256 externalId, Asset[] items, Asset[] price);
  Lend = "Lend(address,address,uint64,uint256,(uint8,address,uint256,uint256),(uint8,address,uint256,uint256)[])",
  LendMany = "LendMany(address,address,uint64,uint256,(uint8,address,uint256,uint256)[],(uint8,address,uint256,uint256)[])",
  // MODULE:MYSTERY
  // event Mysterybox(address from, uint256 externalId, Asset[] items, Asset[] price);
  PurchaseMysteryBox = "PurchaseMysteryBox(address,uint256,(uint8,address,uint256,uint256)[],(uint8,address,uint256,uint256)[])",
  // MODULE:GRADE
  // event Upgrade(address account, uint256 externalId, Asset item, Asset[] price, bytes32 attribute, uint256 level);
  Upgrade = "Upgrade(address,uint256,(uint8,address,uint256,uint256),(uint8,address,uint256,uint256)[],bytes32,uint256)",
  // MODULE:WAITLIST
  //   event WaitListRewardSet(uint256 externalId, bytes32 root, Asset[] items);
  //   event WaitListRewardClaimed(address account, uint256 externalId, Asset[] items);
  WaitListRewardSet = "WaitListRewardSet(uint256,bytes32,(uint8,address,uint256,uint256)[])",
  WaitListRewardClaimed = "WaitListRewardClaimed(address,uint256,(uint8,address,uint256,uint256)[])",
  // MODULE:BREEDING
  // event Breed(address from, uint256 externalId, Asset matron, Asset sire);
  Breed = "Breed(address,uint256,(uint8,address,uint256,uint256),(uint8,address,uint256,uint256))",
  // MODULE:GRADE
  // event LevelUp(address account, uint256 tokenId, bytes32 attribute, uint256 value);
  LevelUp = "LevelUp(address,uint256,bytes32,uint256)",
  // MODULE:DISMANTLE
  Dismantle = "Dismantle(address,uint256,(uint8,address,uint256,uint256)[],(uint8,address,uint256,uint256)[])",
  MetadataUpdate = "MetadataUpdate(uint256)",
  BatchMetadataUpdate = "BatchMetadataUpdate(uint256,uint256)",
  // MODULE:PAYMENT_SPLITTER
  PayeeAdded = "PayeeAdded(address,uint256)",
  PaymentReleased = "PaymentReleased(address,uint256)",
  ERC20PaymentReleased = "ERC20PaymentReleased(address,address,uint256)",
  PaymentReceived = "PaymentReceived(address,uint256)",
  PaymentEthReceived = "PaymentEthReceived(address,uint256)",
  PaymentEthSent = "PaymentEthSent(address,uint256)",

  // MODULE:PONZI
  FinalizedToken = "FinalizedToken(address,uint256)",
  WithdrawToken = "WithdrawToken(address,uint256)",
  ReferralBonus = "ReferralBonus(address,address,uint256)",

  // MODULE:CHAINLINKV2
  RandomWordsRequested = "RandomWordsRequested(bytes32,uint256,uint256,uint64,uint16,uint32,uint32,address)",
  RandomnessRequestId = "RandomnessRequestId(bytes32,address)",
  SubscriptionConsumerAdded = "SubscriptionConsumerAdded(uint64,address)",
  SubscriptionCreated = "SubscriptionCreated(uint64,address)",
  VrfSubscriptionSet = "VrfSubscriptionSet(uint64)",

  // MODULE:ECOMMERCE
  EcommercePurchase = "EcommercePurchase(??)",

  // MODULE:REFERRAL
  ReferralProgram = "ReferralProgram((uint256,uint256,uint8,bool))",
  ReferralReward = "ReferralReward(address,address,uint8,address,uint256)",
  ReferralWithdraw = "ReferralWithdraw(address,address,uint256)",

  // MODULE:CM
  // event VestingDeployed(address account, uint256 externalId, VestingArgs args, Asset[] items);
  VestingDeployed = "VestingDeployed(address,uint256,(address,uint64,uint16,uint16),(uint8,address,uint256,uint256)[])",
  // event ERC20TokenDeployed(address account, uint256 externalId, Erc20Args args);
  ERC20TokenDeployed = "ERC20TokenDeployed(address,uint256,(string,string,uint256,string))",
  ERC721TokenDeployed = "ERC721TokenDeployed(address,uint256,(string,string,uint96,string,string))",
  ERC998TokenDeployed = "ERC998TokenDeployed(address,uint256,(string,string,uint96,string,string))",
  ERC1155TokenDeployed = "ERC1155TokenDeployed(address,uint256,(uint96,string,string))",
  MysteryboxDeployed = "MysteryboxDeployed(address,uint256,(string,string,uint96,string,string))",
  CollectionDeployed = "CollectionDeployed(address,uint256,(string,string,uint96,string,uint96,string))",
  PonziDeployed = "PonziDeployed(address,uint256,(address[],uint256[],string))",
  StakingDeployed = "StakingDeployed(address,uint256,(string))",
  LotteryDeployed = "LotteryDeployed(address,uint256,((uint256,uint256)))",
  RaffleDeployed = "RaffleDeployed(address,uint256)",
  WaitListDeployed = "WaitListDeployed(address,uint256)",

  // MODULE:ERC1363
  TransferReceived = "TransferReceived(address,address,uint256,bytes)",
}

export type TContractEventData =
  | TContractManagerEventData

  // hierarchy
  | TErc20Events
  | TErc721Events
  | TErc998Events
  | TErc1155Events
  | TErc1363Events

  // mechanics
  | TVestingEvents
  | TMysteryEvents
  | TWrapperEvents
  | TStakingEvents
  | TLotteryEvents
  | TRaffleEvents
  | TPonziEvents
  | TWaitListEvents

  // extensions
  | TRoyaltyEvents
  | TPausableEvents
  | TAccessControlEvents
  | TAccessListEvents

  // integrations
  | TChainLinkEvents

  // erc4907
  | TErc4907Events

  // Upgrade
  | TUpgradeEvents

  // exchange
  | TExchangeEvents
  | TReferralEventData;

export interface IEventHistory extends IDeployable {
  transactionHash: string;
  eventType: ContractEventType;
  eventData: TContractEventData;
  contractId: number | null;
  contract?: IContract;
  tokenId: number | null;
  token?: IToken;
  parentId: number | null;
  parent?: IEventHistory;
  assets?: Array<IAssetComponentHistory>;
}

export interface IEventHistoryReport extends IEventHistory {
  items: Array<IAssetComponentHistory>;
  price: Array<IAssetComponentHistory>;
}
