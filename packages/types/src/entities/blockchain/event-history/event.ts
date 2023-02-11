import type { IIdDateBase } from "@gemunion/types-collection";

import { IContract } from "../hierarchy/contract";
import { IToken } from "../hierarchy/token";
import { TVestingEvents } from "./vesting";
import { TExchangeEvents } from "./exchange";
import { TAccessControlEvents } from "./access-control";
import { TAccessListEvents } from "./access-list";
import { TContractManagerEventData } from "./contract-manager";
import { TStakingEvents } from "./staking";
import { TLotteryEventData } from "./lottery";
import { TPyramidEventData } from "./pyramid";
import { TReferralEventData } from "./referral";
import { TPausableEvents } from "./pausable";
import { TErc20Events } from "./erc20";
import { TErc721Events } from "./erc721";
import { TErc1155Events } from "./erc1155";
import { TChainLinkEvents } from "./chain-link";
import { TRoyaltyEvents } from "./royalty";
import { TErc998Events } from "./erc998";
import { TClaimEvents } from "./claim";
import { TMysteryEvents } from "./mystery";
import { TWrapperEvents } from "./wrapper";
import { IAssetComponentHistory } from "../exchange/asset-component-history";

export enum ContractEventType {
  // MODULE:ERC20
  Snapshot = "Snapshot",

  // MODULE:ERC721
  Approval = "Approval",
  ApprovalForAll = "ApprovalForAll",
  DefaultRoyaltyInfo = "DefaultRoyaltyInfo",
  MintRandom = "MintRandom",
  TokenRoyaltyInfo = "TokenRoyaltyInfo",
  Transfer = "Transfer",
  ConsecutiveTransfer = "ConsecutiveTransfer",

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

  // exchange
  | TExchangeEvents
  | TReferralEventData;

export interface IEventHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ContractEventType;
  eventData: TContractEventData;
  contractId: number | null;
  contract?: IContract;
  tokenId: number | null;
  token?: IToken;
  assets?: Array<IAssetComponentHistory>;
}
