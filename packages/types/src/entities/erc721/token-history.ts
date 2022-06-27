import { IIdDateBase } from "@gemunion/types-collection";

import { IUniToken } from "../uni-token/uni-token";

export enum Erc721TokenEventType {
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

export interface IErc721TokenTransfer {
  from: string;
  to: string;
  tokenId: string;
}

export interface IErc721TokenMintRandom {
  to: string;
  tokenId: string;
  templateId: string;
  rarity: string;
  dropboxId: string;
}

export interface IErc721TokenApprove {
  owner: string;
  approved: string;
  tokenId: string;
}

export interface IErc721TokenApprovedForAll {
  owner: string;
  operator: string;
  approved: boolean;
}

export interface IErc721DefaultRoyaltyInfo {
  royaltyReceiver: string;
  royaltyNumerator: string;
}

export interface IErc721TokenRoyaltyInfo {
  tokenId: string;
  royaltyReceiver: string;
  royaltyNumerator: boolean;
}

export interface IErc721DropboxUnpack {
  collection: string;
  tokenId: string;
  templateId: string;
}

export interface IErc721AirdropUnpack {
  collection: string;
  tokenId: string;
  templateId: string;
  airdropId: string;
}

export interface IErc721AirdropRedeem {
  from: string;
  collection: string;
  tokenId: string;
  templateId: string;
  price: string;
}

// dev random test
export interface IErc721RandomRequest {
  requestId: string;
}

export type TErc721TokenEventData =
  | IErc721TokenTransfer
  | IErc721TokenApprove
  | IErc721TokenApprovedForAll
  | IErc721DefaultRoyaltyInfo
  | IErc721TokenRoyaltyInfo
  | IErc721DropboxUnpack
  | IErc721AirdropUnpack
  | IErc721AirdropRedeem
  | IErc721TokenMintRandom
  | IErc721RandomRequest;

export interface IErc721TokenHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: Erc721TokenEventType;
  eventData: TErc721TokenEventData;
  uniTokenId: number | null;
  uniToken?: IUniToken;
}
