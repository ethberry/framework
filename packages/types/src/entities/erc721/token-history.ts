import { IIdBase } from "@gemunion/types-collection";
import { IErc721Token } from "./token";

export enum Erc721TokenEventType {
  Transfer = "Transfer",
  Approval = "Approval",
  ApprovalForAll = "ApprovalForAll",
  DefaultRoyaltyInfo = "DefaultRoyaltyInfo",
  TokenRoyaltyInfo = "TokenRoyaltyInfo",
  Unpack = "Unpack",
  UnpackAirdrop = "UnpackAirdrop",
  Redeem = "Redeem",
  MintRandom = "MintRandom",
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

export interface IErc721TokenUnpack {
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

export interface IErc721TokenRedeem {
  from: string;
  collection: string;
  tokenId: string;
  templateId: string;
  price: string;
}

export interface IErc721AirdropRedeem {
  from: string;
  collection: string;
  tokenId: string;
  templateId: string;
  price: string;
}

export type TErc721TokenEventData =
  | IErc721TokenTransfer
  | IErc721TokenApprove
  | IErc721TokenApprovedForAll
  | IErc721DefaultRoyaltyInfo
  | IErc721TokenRoyaltyInfo
  | IErc721TokenUnpack
  | IErc721AirdropUnpack
  | IErc721TokenRedeem
  | IErc721AirdropRedeem
  | IErc721TokenMintRandom;

export interface IErc721TokenHistory extends IIdBase {
  address: string;
  transactionHash: string;
  eventType: Erc721TokenEventType;
  eventData: TErc721TokenEventData;
  erc721TokenId: number | null;
  erc721Token?: IErc721Token;
}
