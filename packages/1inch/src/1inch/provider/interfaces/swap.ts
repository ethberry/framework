import type { IToken } from "./token";

export interface ISwap {
  fromToken: IToken;
  toToken: IToken;
  toTokenAmount: string;
  fromTokenAmount: string;
  protocols: Array<string>;
  tx: {
    from: string;
    to: string;
    data: string;
    value: string;
    gasPrice: string;
    gas: string;
  };
}
