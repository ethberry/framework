import { IToken } from "./token";

export interface IQuote {
  fromToken: IToken;
  toToken: IToken;
  toTokenAmount: string;
  fromTokenAmount: string;
  protocols: [
    {
      name: string;
      part: number;
      fromTokenAddress: string;
      toTokenAddress: string;
    },
  ];
  estimatedGas: number;
}
