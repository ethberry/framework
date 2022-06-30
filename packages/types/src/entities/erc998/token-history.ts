import { IIdDateBase } from "@gemunion/types-collection";
import { IToken } from "../hierarchy/token";

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

export interface ITokenTransfer {
  from: string;
  to: string;
  tokenId: string;
}

export interface ITokenMintRandom {
  to: string;
  tokenId: string;
  templateId: string;
  rarity: string;
  dropboxId: string;
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

export interface IErc998DefaultRoyaltyInfo {
  royaltyReceiver: string;
  royaltyNumerator: string;
}

export interface ITokenRoyaltyInfo {
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
  | ITokenTransfer
  | ITokenApprove
  | ITokenApprovedForAll
  | IErc998DefaultRoyaltyInfo
  | ITokenRoyaltyInfo
  | IErc998DropboxUnpack
  | IErc998AirdropUnpack
  | IErc998AirdropRedeem
  | ITokenMintRandom
  | IErc998RandomRequest;

export interface ITokenHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: Erc998TokenEventType;
  eventData: TErc998TokenEventData;
  tokenId: number | null;
  token?: IToken;
}
