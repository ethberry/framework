import { createContext } from "react";
import { DebouncedState } from "use-debounce";

import { Networks } from "@gemunion/provider-wallet";

import { GasPrice, IQuote, ISpender, ISwap, IToken, Slippage } from "./interfaces";

export interface IOneInchContext {
  setNetwork: (network: Partial<Networks>) => void;
  getNetwork: () => Partial<Networks>;
  getRpcUrl: () => string | undefined;
  setGasPrice: (gasPrice: GasPrice) => void;
  getGasPrice: () => GasPrice;
  setSlippage: (slippage: Slippage) => void;
  getSlippage: () => Slippage;
  setOpenNetworkDialog: (open: boolean) => void;
  getOpenNetworkDialog: () => boolean;
  getAllTokens: () => Array<IToken>;
  getQuote: DebouncedState<(fromToken: IToken, toToken: IToken, amount: string) => Promise<IQuote>>;
  approveSpender: (fromToken: string) => Promise<ISpender>;
  swap: (fromToken: IToken, toToken: IToken, amount: string, fromAddress: string, slippage: number) => Promise<ISwap>;
}

export const OneInchContext = createContext<IOneInchContext>(undefined!);
