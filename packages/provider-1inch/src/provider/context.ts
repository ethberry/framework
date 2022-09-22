import { createContext } from "react";

import { EnabledLanguages } from "@framework/constants";

import { Networks } from "./constants";
import { GasPrice, IQuote, ISpender, ISwap, IToken, Slippage, ThemeType } from "./interfaces";

export interface IOneInchContext {
  setLanguage: (language: EnabledLanguages) => void;
  getLanguage: () => EnabledLanguages;
  setTheme: (theme: ThemeType) => void;
  getTheme: () => ThemeType;
  setNetwork: (network: Partial<Networks>) => void;
  getNetwork: () => Partial<Networks>;
  setGasPrice: (gasPrice: GasPrice) => void;
  getGasPrice: () => GasPrice;
  setSlippage: (slippage: Slippage) => void;
  getSlippage: () => Slippage;
  setOpenNetworkDialog: (open: boolean) => void;
  getOpenNetworkDialog: () => boolean;
  getAllTokens: () => Array<IToken>;
  getQuote: (fromToken: IToken, toToken: IToken, amountToSend: string) => Promise<IQuote>;
  approveSpender: () => Promise<ISpender>;
  swap: (fromToken: IToken, toToken: IToken, amount: string, fromAddress: string, slippage: number) => Promise<ISwap>;
}

export const OneInchContext = createContext<IOneInchContext>(undefined!);
