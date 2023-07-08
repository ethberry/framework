import { FC } from "react";
import { useWeb3React } from "@web3-react/core";
import { SwapWidget } from "@uniswap/widgets";
import "@uniswap/widgets/fonts.css";

import { rpcUrls } from "@gemunion/provider-wallet";

import { Wrapper } from "./styled";

export const TOKEN_LIST = "https://raw.githubusercontent.com/plasmadlt/plasma-finance-token-list/master/bnb.json";

export const UniswapWidget: FC = () => {
  const { provider, chainId } = useWeb3React();

  return (
    <Wrapper>
      <SwapWidget jsonRpcUrlMap={rpcUrls} defaultChainId={chainId} tokenList={TOKEN_LIST} provider={provider} />
    </Wrapper>
  );
};
