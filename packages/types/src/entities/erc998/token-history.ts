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

export interface IErc998TokenTransfer {
  from: string;
  to: string;
  tokenId: string;
}

export interface IErc998TokenMintRandom {
  to: string;
  tokenId: string;
  templateId: string;
  rarity: string;
  dropboxId: string;
}

export interface IErc998TokenApprove {
  owner: string;
  approved: string;
  tokenId: string;
}

export interface IErc998TokenApprovedForAll {
  owner: string;
  operator: string;
  approved: boolean;
}

export interface IErc998DefaultRoyaltyInfo {
  royaltyReceiver: string;
  royaltyNumerator: string;
}

export interface IErc998TokenRoyaltyInfo {
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
  | IErc998TokenTransfer
  | IErc998TokenApprove
  | IErc998TokenApprovedForAll
  | IErc998DefaultRoyaltyInfo
  | IErc998TokenRoyaltyInfo
  | IErc998DropboxUnpack
  | IErc998AirdropUnpack
  | IErc998AirdropRedeem
  | IErc998TokenMintRandom
  | IErc998RandomRequest;

export interface IErc998TokenHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: Erc998TokenEventType;
  eventData: TErc998TokenEventData;
  uniTokenId: number | null;
  uniToken?: IUniToken;
}
