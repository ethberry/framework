import { IIdDateBase } from "@gemunion/types-collection";

export enum ContractEventType {
  Approval = "Approval",
  ApprovalForAll = "ApprovalForAll",
  DefaultRoyaltyInfo = "DefaultRoyaltyInfo",
  MintRandom = "MintRandom",
  Paused = "Paused",
  RandomRequest = "RandomRequest",
  RedeemAirdrop = "RedeemAirdrop",
  Snapshot = "Snapshot",
  TokenRoyaltyInfo = "TokenRoyaltyInfo",
  Transfer = "Transfer",
  TransferBatch = "TransferBatch",
  TransferSingle = "TransferSingle",
  URI = "URI",
  UnpackAirdrop = "UnpackAirdrop",
  UnpackLootbox = "UnpackLootbox",
  Unpaused = "Unpaused",
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

export interface ILootboxUnpack {
  collection: string;
  tokenId: string;
  templateId: string;
}

export interface IAirdropUnpack {
  collection: string;
  tokenId: string;
  templateId: string;
  airdropId: string;
}

export interface IAirdropRedeem {
  from: string;
  collection: string;
  tokenId: string;
  templateId: string;
  price: string;
}

// dev random test
export interface IRandomRequest {
  requestId: string;
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
  lootboxId: string;
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
  | IAirdropRedeem
  | IAirdropUnpack
  | IDefaultRoyaltyInfo
  | ILootboxUnpack
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
  | ITokenTransfer;

export interface IContractHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ContractEventType;
  eventData: TContractEventData;
}
