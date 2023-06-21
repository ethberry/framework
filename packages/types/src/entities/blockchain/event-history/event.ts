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
import type { TPyramidEvents } from "./mechanics/pyramid";
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

  // MODULE MYSTERY
  UnpackMysterybox = "UnpackMysterybox",

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
  // MODULE:RENTABLE
  UpdateUser = "UpdateUser",
  Lend = "Lend",
  // MODULE:MYSTERY
  Mysterybox = "Mysterybox",
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

  // MODULE:CHAINLINKV2
  RandomWordsRequested = "RandomWordsRequested",

  // MODULE:ECOMMERCE
  EcommercePurchase = "EcommercePurchase",
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
  | TPyramidEvents
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
  items: IAssetComponentHistory[];
  price: IAssetComponentHistory[];
}
