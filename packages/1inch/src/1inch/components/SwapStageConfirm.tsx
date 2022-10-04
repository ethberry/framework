import { FC, useMemo } from "react";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useIntl } from "react-intl";

import { GovernanceTokenAddress, ISwap, IToken } from "../provider";
import { calc } from "../helpers/calc";
import { useAllTokens } from "../hooks/useAllTokens";
import { useCoinPriceUSD } from "../hooks/useCoinPriceUSD";
import { CoinPriceUSD } from "./CoinPriceUSD";
import { LoadingText } from "./LoadingText";

import {
  StyledButton,
  StyledButtonGroup,
  StyledSwapContainer,
  StyledSwapFormContainer,
  StyledSwapHeader,
  StyledSwapHeaderItem,
} from "./swap/styled";

export interface ISwapStageConfirmProps {
  swap: ISwap | null;
  fromToken: IToken;
  confirm: () => void;
  deny: () => void;
}

export const SwapStageConfirm: FC<ISwapStageConfirmProps> = props => {
  const { swap, fromToken, confirm, deny } = props;
  const allTokens = useAllTokens();
  const { formatMessage } = useIntl();

  const swapStats = useMemo(() => {
    if (!swap) {
      return {
        fromTokenQuantity: "1",
        toTokenQuantity: "1",
        fee: "0",
        rate: "",
      };
    }
    const fromTokenQuantity = formatUnits(
      BigNumber.from(swap.fromTokenAmount),
      BigNumber.from(swap.fromToken.decimals),
    );
    const toTokenQuantity = formatUnits(BigNumber.from(swap.toTokenAmount), BigNumber.from(swap.toToken.decimals));
    const rate = calc`${fromTokenQuantity} / ${toTokenQuantity}`;
    const feeRaw = calc`${swap.tx.gas} * ${swap.tx.gasPrice}`;

    return {
      toTokenQuantity,
      fromTokenQuantity,
      rate,
      gasPrice: formatUnits(BigNumber.from(swap.tx.gasPrice), "gwei"),
      fee: formatUnits(BigNumber.from(feeRaw), "ether"),
    };
  }, [swap]);

  const ethToken = useMemo(() => allTokens.find(t => t.address === GovernanceTokenAddress)!, [allTokens]);

  const costInUSD = useCoinPriceUSD({
    token: fromToken,
    tokenQuantity: swapStats.fromTokenQuantity,
  });

  const txFeeInUSD = useCoinPriceUSD({
    token: ethToken,
    tokenQuantity: swapStats.fee,
  });

  const totalInUSD = useMemo(
    () => (txFeeInUSD && costInUSD ? calc`${txFeeInUSD} + ${costInUSD}` : ""),
    [txFeeInUSD, costInUSD],
  );
  return (
    <StyledSwapContainer>
      <StyledSwapHeader>
        <StyledSwapHeaderItem>{formatMessage({ id: "pages.1inch.swap.confirm" })}</StyledSwapHeaderItem>
      </StyledSwapHeader>
      <StyledSwapFormContainer>
        <small
          style={{
            display: "block",
            whiteSpace: "nowrap",
            overflowX: "scroll",
          }}
        >
          <code>
            {"  "}
            <b>{formatMessage({ id: "pages.1inch.swap.product" })}:</b> {swap?.toToken.symbol}
          </code>
          <br />
          <code>
            <span title={swapStats.toTokenQuantity}>
              <b>{formatMessage({ id: "pages.1inch.swap.quantity" })}:</b> {+swapStats.toTokenQuantity}
            </span>
          </code>
          <br />
          <code>
            <span title={swapStats.rate}>
              × <b>{formatMessage({ id: "pages.1inch.swap.rate" })}:</b> {+swapStats.rate}
            </span>{" "}
            {swap?.fromToken.symbol}/{swap?.toToken.symbol}
          </code>
          <br />
          <code>
            + <b>{formatMessage({ id: "pages.1inch.swap.gasPrice" })}:</b> <LoadingText text={swapStats.gasPrice} />{" "}
            {formatMessage({ id: "pages.1inch.swap.gwei" })}
          </code>
          <br />
          <code>
            × <b>{formatMessage({ id: "pages.1inch.swap.gas" })}:</b> <LoadingText text={swap?.tx.gas.toString()} />
          </code>
          <br />
          <hr />
          <code>
            <b> {formatMessage({ id: "pages.1inch.swap.cost" })}:</b> {swapStats.fromTokenQuantity}{" "}
            {swap?.fromToken.symbol} (
            <CoinPriceUSD token={fromToken} tokenQuantity={swapStats.fromTokenQuantity} />)
          </code>
          <br />
          <code>
            <b>
              {"+"} {formatMessage({ id: "pages.1inch.swap.fee" })}:
            </b>{" "}
            <LoadingText text={swapStats.fee} /> {formatMessage({ id: "pages.1inch.swap.ETH" })} (
            <CoinPriceUSD token={ethToken} tokenQuantity={swapStats.fee} />)
          </code>
          <br />
          <hr />
          <code>
            <b>{formatMessage({ id: "pages.1inch.swap.total" })}:</b> ≈$
            <LoadingText text={totalInUSD} />
          </code>
        </small>
        <br />
        <br />
        <StyledButtonGroup>
          <StyledButton onClick={() => deny()} light>
            {formatMessage({ id: "pages.1inch.buttons.cancel" })}
          </StyledButton>
          <StyledButton onClick={() => confirm()}>{formatMessage({ id: "pages.1inch.buttons.confirm" })}</StyledButton>
        </StyledButtonGroup>
      </StyledSwapFormContainer>
    </StyledSwapContainer>
  );
};
