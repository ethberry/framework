export enum Erc998EventType {
  BatchReceivedChild = "BatchReceivedChild",
  BatchTransferChild = "BatchTransferChild",
  WhitelistedChild = "WhitelistedChild",
  UnWhitelistedChild = "UnWhitelistedChild",
  ReceivedChild = "ReceivedChild",
  TransferChild = "TransferChild",
  SetMaxChild = "SetMaxChild",
}

export enum Erc998EventSignature {
  BatchReceivedChild = "BatchReceivedChild(address,uint256,address,uint256[],uint256[])",
  BatchTransferChild = "BatchTransferChild(uint256,address,address,uint256[],uint256[])",
  WhitelistedChild = "WhitelistedChild(address,uint256)",
  UnWhitelistedChild = "UnWhitelistedChild(address)",
  ReceivedChild = "ReceivedChild(address,uint256,address,uint256,uint256)",
  TransferChild = "TransferChild(uint256,address,address,uint256,uint256)",
  SetMaxChild = "SetMaxChild(address,uint256)",
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
  tokenId: bigint;
  childContract: string;
  childTokenId: bigint;
  amount: bigint;
}

export interface IErc998TokenTransferChildEvent {
  to: string;
  tokenId: bigint;
  childContract: string;
  childTokenId: bigint;
  amount: bigint;
}

export interface IErc998BatchReceivedChildEvent {
  from: string;
  tokenId: bigint;
  childContract: string;
  childTokenIds: Array<bigint>;
  amounts: Array<bigint>;
}

export interface IErc998BatchTransferChildEvent {
  to: string;
  tokenId: bigint;
  childContract: string;
  childTokenIds: Array<bigint>;
  amounts: Array<bigint>;
}

export type TErc998Events =
  | IErc998TokenWhitelistedChildEvent
  | IErc998TokenUnWhitelistedChildEvent
  | IErc998TokenSetMaxChildEvent
  | IErc998TokenReceivedChildEvent
  | IErc998TokenTransferChildEvent
  | IErc998BatchReceivedChildEvent
  | IErc998BatchTransferChildEvent;
