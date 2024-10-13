import type { IToken } from "@framework/types";

export interface ITokenTransferData {
  token: IToken;
  from: string;
  to: string;
  amount: bigint;
}

export interface IBatchTransferData {
  tokens: Array<IToken>;
  from: string;
  to: string;
  amounts: Array<bigint>;
}

export interface IConsecutiveTransferData {
  tokens: Array<IToken>;
  from: string;
  to: string;
}
