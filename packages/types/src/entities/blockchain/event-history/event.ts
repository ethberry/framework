import type { IDeployable } from "@gemunion/types-blockchain";

import type { IContract } from "../hierarchy/contract";
import type { IToken } from "../hierarchy/token";
import type { TVestingEvents } from "./vesting";
import type { TExchangeEvents } from "./exchange";
import type { TAccessControlEvents } from "./access-control";
import type { TAccessListEvents } from "./access-list";
import type { TContractManagerEventData } from "./contract-manager";
import type { TStakingEvents } from "./staking";
import type { TLotteryEventData } from "./lottery";
import type { TPyramidEventData } from "./pyramid";
import type { TReferralEventData } from "./referral";
import type { TPausableEvents } from "./pausable";
import type { TErc20Events } from "./erc20";
import type { TErc721Events } from "./erc721";
import type { TErc1155Events } from "./erc1155";
import type { TChainLinkEvents } from "./chain-link";
import type { TRoyaltyEvents } from "./royalty";
import type { TErc998Events } from "./erc998";
import type { TClaimEvents } from "./claim";
import type { TMysteryEvents } from "./mystery";
import type { TWrapperEvents } from "./wrapper";
import type { IAssetComponentHistory } from "../exchange/asset-component-history";
import type { TErc1363Events } from "./erc1363";
import type { TErc4907Events } from "./erc4907";

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
  RewardSet = "RewardSet",
  ClaimReward = "ClaimReward",
  // MODULE:BREEDING
  Breed = "Breed",
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
}

export type TContractEventData =
  | TContractManagerEventData

  // hierarchy
  | TErc20Events
  | TErc721Events
  | TErc998Events
  | TErc1155Events

  // mechanics
  | TVestingEvents
  | TClaimEvents
  | TMysteryEvents
  | TWrapperEvents
  | TStakingEvents
  | TLotteryEventData
  | TPyramidEventData

  // extensions
  | TRoyaltyEvents
  | TPausableEvents
  | TAccessControlEvents
  | TAccessListEvents

  // integrations
  | TChainLinkEvents

  // erc1363
  | TErc1363Events

  // erc4907
  | TErc4907Events

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
