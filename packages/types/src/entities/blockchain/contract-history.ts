import type { IIdDateBase } from "@gemunion/types-collection";
import { IContract } from "./hierarchy/contract";
import { IToken } from "./hierarchy/token";

export enum ContractEventType {
  Approval = "Approval",
  ApprovalForAll = "ApprovalForAll",
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

export interface IPaused {
  account: string;
}

export interface IErc20TokenTransfer {
  from: string;
  to: string;
  value: string;
}

export interface IErc20TokenApprove {
  owner: string;
  spender: string;
  value: string;
}

export interface IErc20TokenSnapshot {
  id: string;
}

export interface IMysteryboxUnpack {
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
export interface IErc998TokenWhitelistedChild {
  addr: string;
  maxCount: string;
}

export interface IErc998TokenUnWhitelistedChild {
  addr: string;
}

export interface IErc998TokenSetMaxChild {
  addr: string;
  maxCount: string;
}

export interface IErc998TokenReceivedChild {
  from: string;
  tokenId: string;
  childContract: string;
  childTokenId: string;
}

export interface IErc998TokenTransferChild {
  to: string;
  tokenId: string;
  childContract: string;
  childTokenId: string;
}

export interface ITokenTransfer {
  from: string;
  to: string;
  tokenId: string;
}

// dev random test
export interface IRandomRequest {
  requestId: string;
}

export interface ITokenMintRandom {
  requestId: string;
  to: string;
  randomness: string;
  templateId: string;
  tokenId: string;
}

export interface ITokenApprove {
  owner: string;
  approved: string;
  tokenId: string;
}

export interface ITokenApprovedForAll {
  owner: string;
  operator: string;
  approved: boolean;
}

export interface IDefaultRoyaltyInfo {
  royaltyReceiver: string;
  royaltyNumerator: string;
}

export interface ITokenRoyaltyInfo {
  tokenId: string;
  royaltyReceiver: string;
  royaltyNumerator: boolean;
}

export interface IErc1155TokenTransferSingle {
  operator: string;
  from: string;
  to: string;
  id: string;
  value: string;
}

export interface IErc1155TokenTransferBatch {
  operator: string;
  from: string;
  to: string;
  ids: Array<string>;
  values: Array<string>;
}

export interface IErc1155TokenApprovalForAll {
  account: string;
  operator: string;
  approved: boolean;
}

export interface IErc1155TokenUri {
  value: string;
  id: string;
}

export interface IErc1155RoleGrant {
  role: string;
  account: string;
  sender: string;
}

export type TContractEventData =
  | IClaimRedeem
  | IClaimUnpack
  | IDefaultRoyaltyInfo
  | IMysteryboxUnpack
  | IErc1155TokenApprovalForAll
  | IErc1155TokenTransferBatch
  | IErc1155TokenTransferSingle
  | IErc1155TokenUri
  | IErc20TokenApprove
  | IErc20TokenSnapshot
  | IErc20TokenTransfer
  | IRandomRequest
  | ITokenApprove
  | ITokenApprovedForAll
  | ITokenMintRandom
  | ITokenRoyaltyInfo
  | ITokenTransfer
  | IErc998TokenReceivedChild
  | IErc998TokenTransferChild
  | IErc998TokenSetMaxChild
  | IErc998TokenUnWhitelistedChild
  | IErc998TokenWhitelistedChild
  | IPaused;

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
