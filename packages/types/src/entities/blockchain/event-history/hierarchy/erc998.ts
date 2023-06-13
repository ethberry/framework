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

export type TErc998Events =
  | IErc998TokenWhitelistedChildEvent
  | IErc998TokenUnWhitelistedChildEvent
  | IErc998TokenSetMaxChildEvent
  | IErc998TokenReceivedChildEvent
  | IErc998TokenTransferChildEvent
  | IErc998BatchReceivedChildEvent
  | IErc998BatchTransferChildEvent;
