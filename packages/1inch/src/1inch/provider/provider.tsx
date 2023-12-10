import { FC, PropsWithChildren, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { useApiCall } from "@gemunion/react-hooks";
import { useLicense } from "@gemunion/provider-license";
import { Networks, networkToChainId, rpcUrls } from "@gemunion/provider-wallet";

import { GasPrice, IQuote, ISpender, ISwap, IToken, Slippage } from "./interfaces";

import { OneInchContext } from "./context";

interface ISettings {
  network?: Partial<Networks>;
  gasPrice?: GasPrice;
  slippage?: Slippage;
}

export interface IOneInchProviderProps {
  baseUrl?: string;
  defaultNetwork?: Partial<Networks>;
  defaultGasPrice?: GasPrice;
  defaultSlippage?: Slippage;
}

const STORAGE_NAME = "settings";

export const OneInchProvider: FC<PropsWithChildren<IOneInchProviderProps>> = props => {
  const {
    children,
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

  const save = (key: string, data: any): void => {
    const json = JSON.stringify(data);
    localStorage.setItem(key, json);
  };

  const getNetwork = (): Partial<Networks> => {
    return settings.network || defaultNetwork;
  };

  const setNetwork = (network: Partial<Networks>): void => {
    const newSettings = { ...settings, network };
    setSettings(newSettings);
    save(STORAGE_NAME, newSettings);
  };

  const getRpcUrl = (): string | undefined => {
    const chainId = networkToChainId[getNetwork()];
    return rpcUrls[chainId][0];
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

  const { fn: apiCall } = useApiCall(
    (api, { url, data }: any) => {
      return api.fetchJson({
        url: `/1inch/${url}`,
        data,
      });
    },
    { success: false, error: false },
  );

  const request = <T,>(url: string, data: Record<string, any> = {}): Promise<T> => {
    return apiCall(void 0, {
      url,
      data,
    }) as Promise<T>;
  };

  const getTokenList = (): Promise<{ tokens: Array<IToken> }> => {
    const chainId = networkToChainId[getNetwork()];
    return request<{ tokens: Array<IToken> }>("token-list", {
      chainId,
    });
  };

  useEffect(() => {
    void getTokenList().then(r => {
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

  const getQuote = useDebouncedCallback((fromToken: IToken, toToken: IToken, amount: string): Promise<IQuote> => {
    return request<IQuote>("quote", {
      src: fromToken.address,
      dst: toToken.address,
      amount,
      chainId: networkToChainId[getNetwork()],
      includeGas: true,
      includeProtocols: true,
      includeTokensInfo: true,
    });
  }, 1000);

  const approveSpender = (tokenAddress: string): Promise<ISpender> => {
    return request<ISpender>("approve", {
      tokenAddress,
      chainId: networkToChainId[getNetwork()],
    });
  };

  const swap = (
    fromToken: IToken,
    toToken: IToken,
    amount: string,
    fromAddress: string,
    slippage: number,
  ): Promise<ISwap> => {
    return request<ISwap>(`swap`, {
      src: toToken.address,
      dst: fromToken.address,
      amount,
      from: fromAddress,
      slippage,
      chainId: networkToChainId[getNetwork()],
    });
  };

  if (!license.isValid()) {
    return null;
  }

  return (
    <OneInchContext.Provider
      value={{
        getNetwork,
        setNetwork,
        getRpcUrl,
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
