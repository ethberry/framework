import type { IToken } from "./token";

export interface IQuote {
  fromToken: IToken;
  toToken: IToken;
  toAmount: string;
  fromAmount: string;
  protocols: Array<
    [
      [
        {
          name: string;
          part: number;
          src: string;
          dst: string;
        },
      ],
    ]
  >;
  gas: number;
}
