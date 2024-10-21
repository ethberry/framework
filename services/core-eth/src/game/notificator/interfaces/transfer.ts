import type { ITemplate, IToken } from "@framework/types";

export interface ITokenTransferData {
  token: IToken;
  from: string;
  to: string;
  amount: string;
}

export interface IBatchTransferData {
  tokens: Array<IToken>;
  from: string;
  to: string;
  amounts: Array<string>;
}

export interface IConsecutiveTransferData {
  template: ITemplate;
  tokens: Array<IToken>;
  from: string;
  to: string;
}
