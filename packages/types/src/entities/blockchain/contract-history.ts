import type { IIdDateBase } from "@gemunion/types-collection";
import { IContract } from "./hierarchy/contract";
import { IToken } from "./hierarchy/token";

export enum ContractEventType {
  Approval = "Approval",
  ApprovalForAll = "ApprovalForAll",
  BatchReceivedChild = "BatchReceivedChild",
  BatchTransferChild = "BatchTransferChild",
  DefaultRoyaltyInfo = "DefaultRoyaltyInfo",
  MintRandom = "MintRandom",
  Paused = "Paused",
  RandomRequest = "RandomRequest",
  ReceivedChild = "ReceivedChild",
  RedeemClaim = "RedeemClaim",
  SetMaxChild = "SetMaxChild",
  Snapshot = "Snapshot",
  TokenRoyaltyInfo = "TokenRoyaltyInfo",
  Transfer = "Transfer",
  TransferBatch = "TransferBatch",
  TransferChild = "TransferChild",
  TransferSingle = "TransferSingle",
  URI = "URI",
  UnWhitelistedChild = "UnWhitelistedChild",
  UnpackClaim = "UnpackClaim",
  UnpackMysterybox = "UnpackMysterybox",
  Unpaused = "Unpaused",
  WhitelistedChild = "WhitelistedChild",
}

export interface IPausedEvent {
  account: string;
}

export interface IErc20TokenTransferEvent {
  from: string;
  to: string;
  value: string;
}

export interface IErc20TokenApproveEvent {
  owner: string;
  spender: string;
  value: string;
}

export interface IErc20TokenSnapshotEvent {
  id: string;
}

export interface IMysteryUnpackEvent {
  collection: string;
  tokenId: string;
  templateId: string;
}

export interface IClaimUnpack {
  collection: string;
  tokenId: string;
  templateId: string;
  claimId: string;
}

export interface IClaimRedeem {
  from: string;
  collection: string;
  tokenId: string;
  templateId: string;
  price: string;
}

// 998
export interface IErc998TokenWhitelistedChildEvent {
  addr: string;
  maxCount: string;
}

export interface IErc998TokenUnWhitelistedChildEvent {
  addr: string;
}

export interface IErc998TokenSetMaxChildEvent {
  addr: string;
  maxCount: string;
}

export interface IErc998TokenReceivedChildEvent {
  from: string;
  tokenId: string;
  childContract: string;
  childTokenId: string;
  amount: string;
}

export interface IErc998TokenTransferChildEvent {
  to: string;
  tokenId: string;
  childContract: string;
  childTokenId: string;
  amount: string;
}

export interface IErc998BatchReceivedChildEvent {
  from: string;
  tokenId: string;
  childContract: string;
  childTokenIds: Array<string>;
  amounts: Array<string>;
}

export interface IErc998BatchTransferChildEvent {
  to: string;
  tokenId: string;
  childContract: string;
  childTokenIds: Array<string>;
  amounts: Array<string>;
}

export interface IERC721TokenTransferEvent {
  from: string;
  to: string;
  tokenId: string;
}

// dev random test
export interface IERC721RandomRequestEvent {
  requestId: string;
}

export interface IERC721TokenMintRandomEvent {
  requestId: string;
  to: string;
  randomness: string;
  templateId: string;
  tokenId: string;
}

export interface IERC721TokenApproveEvent {
  owner: string;
  approved: string;
  tokenId: string;
}

export interface IERC721TokenApprovedForAllEvent {
  owner: string;
  operator: string;
  approved: boolean;
}

export interface IDefaultRoyaltyInfoEvent {
  royaltyReceiver: string;
  royaltyNumerator: string;
}

export interface ITokenRoyaltyInfoEvent {
  tokenId: string;
  royaltyReceiver: string;
  royaltyNumerator: boolean;
}

export interface IErc1155TokenTransferSingleEvent {
  operator: string;
  from: string;
  to: string;
  id: string;
  value: string;
}

export interface IErc1155TokenTransferBatchEvent {
  operator: string;
  from: string;
  to: string;
  ids: Array<string>;
  values: Array<string>;
}

export interface IErc1155TokenApprovalForAllEvent {
  account: string;
  operator: string;
  approved: boolean;
}

export interface IErc1155TokenUriEvent {
  value: string;
  id: string;
}

export type TContractEventData =
  | IClaimRedeem
  | IClaimUnpack
  | IDefaultRoyaltyInfoEvent
  | IMysteryUnpackEvent
  | IErc1155TokenApprovalForAllEvent
  | IErc1155TokenTransferBatchEvent
  | IErc1155TokenTransferSingleEvent
  | IErc1155TokenUriEvent
  | IErc20TokenApproveEvent
  | IErc20TokenSnapshotEvent
  | IErc20TokenTransferEvent
  | IERC721RandomRequestEvent
  | IERC721TokenApproveEvent
  | IERC721TokenApprovedForAllEvent
  | IERC721TokenMintRandomEvent
  | ITokenRoyaltyInfoEvent
  | IERC721TokenTransferEvent
  | IErc998TokenReceivedChildEvent
  | IErc998TokenTransferChildEvent
  | IErc998BatchReceivedChildEvent
  | IErc998BatchTransferChildEvent
  | IErc998TokenSetMaxChildEvent
  | IErc998TokenUnWhitelistedChildEvent
  | IErc998TokenWhitelistedChildEvent
  | IPausedEvent;

export interface IContractHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ContractEventType;
  eventData: TContractEventData;
  contractId: number | null;
  contract?: IContract;
  tokenId: number | null;
  token?: IToken;
}
