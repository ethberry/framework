import { IIdDateBase } from "@gemunion/types-collection";
import { IUniToken } from "../uni-token/uni-token";

export enum Erc998TokenEventType {
  Approval = "Approval",
  ApprovalForAll = "ApprovalForAll",
  DefaultRoyaltyInfo = "DefaultRoyaltyInfo",
  MintRandom = "MintRandom",
  Paused = "Paused",
  RandomRequest = "RandomRequest",
  RedeemAirdrop = "RedeemAirdrop",
  TokenRoyaltyInfo = "TokenRoyaltyInfo",
  Transfer = "Transfer",
  UnpackAirdrop = "UnpackAirdrop",
  UnpackDropbox = "UnpackDropbox",
  Unpaused = "Unpaused",
}

export interface IUniTokenTransfer {
  from: string;
  to: string;
  tokenId: string;
}

export interface IUniTokenMintRandom {
  to: string;
  tokenId: string;
  templateId: string;
  rarity: string;
  dropboxId: string;
}

export interface IUniTokenApprove {
  owner: string;
  approved: string;
  tokenId: string;
}

export interface IUniTokenApprovedForAll {
  owner: string;
  operator: string;
  approved: boolean;
}

export interface IErc998DefaultRoyaltyInfo {
  royaltyReceiver: string;
  royaltyNumerator: string;
}

export interface IUniTokenRoyaltyInfo {
  tokenId: string;
  royaltyReceiver: string;
  royaltyNumerator: boolean;
}

export interface IErc998DropboxUnpack {
  collection: string;
  tokenId: string;
  templateId: string;
}

export interface IErc998AirdropUnpack {
  collection: string;
  tokenId: string;
  templateId: string;
  airdropId: string;
}

export interface IErc998AirdropRedeem {
  from: string;
  collection: string;
  tokenId: string;
  templateId: string;
  price: string;
}

// dev random test
export interface IErc998RandomRequest {
  requestId: string;
}

export type TErc998TokenEventData =
  | IUniTokenTransfer
  | IUniTokenApprove
  | IUniTokenApprovedForAll
  | IErc998DefaultRoyaltyInfo
  | IUniTokenRoyaltyInfo
  | IErc998DropboxUnpack
  | IErc998AirdropUnpack
  | IErc998AirdropRedeem
  | IUniTokenMintRandom
  | IErc998RandomRequest;

export interface IUniTokenHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: Erc998TokenEventType;
  eventData: TErc998TokenEventData;
  uniTokenId: number | null;
  uniToken?: IUniToken;
}
