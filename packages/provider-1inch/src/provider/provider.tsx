import { FC, useEffect, useState } from "react";
import fetch from "cross-fetch";

import { EnabledLanguages } from "@framework/constants";
import { useLicense } from "@gemunion/provider-license";
import { Networks, networkToChainId } from "./constants";

import { GasPrice, IQuote, ISpender, ISwap, IToken, Slippage, ThemeType } from "./interfaces";

import { OneInchContext } from "./context";

interface ISettings {
  language?: EnabledLanguages;
  themeType?: ThemeType;
  network?: Partial<Networks>;
  gasPrice?: GasPrice;
  slippage?: Slippage;
}

export interface IOneInchProviderProps {
  baseUrl?: string;
  defaultLanguage?: EnabledLanguages;
  defaultThemeType?: ThemeType;
  defaultNetwork?: Partial<Networks>;
  defaultGasPrice?: GasPrice;
  defaultSlippage?: Slippage;
}

const STORAGE_NAME = "settings";

export const OneInchProvider: FC<IOneInchProviderProps> = props => {
  const {
    children,
    baseUrl = "https://api.1inch.exchange/v3.0/",
    defaultLanguage = EnabledLanguages.EN,
    defaultThemeType = ThemeType.light,
    defaultNetwork = Networks.ETHEREUM,
    defaultGasPrice = GasPrice.MEDIUM,
    defaultSlippage = Slippage.HIGH,
  } = props;

  const license = useLicense();

  const [settings, setSettings] = useState<ISettings>({});
  const [isNetworkDialogOpen, setIsNetworkDialogOpen] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_NAME);
    setSettings(data ? JSON.parse(data) : {});
  }, []);

  const save = (key: string, data: any | null): void => {
    const json = JSON.stringify(data);
    localStorage.setItem(key, json);
  };

  const getLanguage = (): EnabledLanguages => {
    return settings.language || defaultLanguage;
  };

  const setLanguage = (language: EnabledLanguages): void => {
    const newSettings = { ...settings, language };
    setSettings(newSettings);
    save(STORAGE_NAME, newSettings);
  };

  const getTheme = (): ThemeType => {
    return settings.themeType || defaultThemeType;
  };

  const setTheme = (themeType: ThemeType): void => {
    const newSettings = { ...settings, themeType };
    setSettings(newSettings);
    save(STORAGE_NAME, newSettings);
  };

  const getNetwork = (): Partial<Networks> => {
    return settings.network || defaultNetwork;
  };

  const setNetwork = (network: Partial<Networks>): void => {
    const newSettings = { ...settings, network };
    setSettings(newSettings);
    save(STORAGE_NAME, newSettings);
  };

  const getGasPrice = (): GasPrice => {
    return settings.gasPrice || defaultGasPrice;
  };

  const setGasPrice = (gasPrice: GasPrice): void => {
    const newSettings = { ...settings, gasPrice };
    setSettings(newSettings);
    save(STORAGE_NAME, newSettings);
  };

  const getSlippage = (): Slippage => {
    return settings.slippage || defaultSlippage;
  };

  const setSlippage = (slippage: Slippage): void => {
    const newSettings = { ...settings, slippage };
    setSettings(newSettings);
    save(STORAGE_NAME, newSettings);
  };

  const getOpenNetworkDialog = (): boolean => {
    return isNetworkDialogOpen;
  };

  const setOpenNetworkDialog = setIsNetworkDialogOpen;

  const [cachedTokens, setCachedTokens] = useState<{ [key: string]: Array<IToken> }>({});

  const request = <T,>(url: string, data: Record<string, any> = {}): Promise<T> => {
    const newUrl = new URL(`${baseUrl}${networkToChainId[getNetwork()]}${url}`);

    Object.keys(data).forEach(key => {
      newUrl.searchParams.append(key, data[key]);
    });

    return fetch(newUrl.toString(), {
      method: "GET",
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      }),
    }).then<T>(r => r.json());
  };

  useEffect(() => {
    void request<{ tokens: Array<IToken> }>("/tokens").then(r => {
      const tokens = Object.values(r.tokens);
      setCachedTokens({
        ...cachedTokens,
        [networkToChainId[getNetwork()]]: tokens,
      });
    });
  }, [networkToChainId[getNetwork()]]);

  const getAllTokens = (): Array<IToken> => {
    return cachedTokens[networkToChainId[getNetwork()]] || [];
  };

  const getQuote = (fromToken: IToken, toToken: IToken, amount: string): Promise<IQuote> => {
    return request<IQuote>("/quote", {
      fromTokenAddress: fromToken.address,
      toTokenAddress: toToken.address,
      amount,
    });
  };

  const approveSpender = (): Promise<ISpender> => {
    return request<ISpender>("/approve/spender");
  };

  const swap = (
    fromToken: IToken,
    toToken: IToken,
    amount: string,
    fromAddress: string,
    slippage: number,
  ): Promise<ISwap> => {
    return request<ISwap>("/swap", {
      toTokenAddress: toToken.address,
      fromTokenAddress: fromToken.address,
      amount,
      fromAddress,
      slippage,
    });
  };

  if (!license.isValid()) {
    return null;
  }

  return (
    <OneInchContext.Provider
      value={{
        getLanguage,
        setLanguage,
        getTheme,
        setTheme,
        getNetwork,
        setNetwork,
        getGasPrice,
        setGasPrice,
        getSlippage,
        setSlippage,
        getOpenNetworkDialog,
        setOpenNetworkDialog,

        getAllTokens,
        getQuote,
        approveSpender,
        swap,
      }}
    >
      {children}
    </OneInchContext.Provider>
  );
};
