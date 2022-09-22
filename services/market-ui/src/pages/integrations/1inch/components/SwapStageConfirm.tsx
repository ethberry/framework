import { FC, useMemo } from "react";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";

import { GovernanceTokenAddress, ISwap, IToken } from "@gemunion/provider-1inch";

import { calc } from "../helpers/calc";
import { useAllTokens } from "../hooks/useAllTokens";
import { useCoinPriceUSD } from "../hooks/useCoinPriceUSD";
import { CoinPriceUSD } from "./CoinPriceUSD";
import { LoadingText } from "./LoadingText";

import { useStyles } from "./swap/styles";

export interface ISwapStageConfirmProps {
  swap: ISwap | null;
  fromToken: IToken;
  confirm: () => void;
  deny: () => void;
}

export const SwapStageConfirm: FC<ISwapStageConfirmProps> = props => {
  const { swap, fromToken, confirm, deny } = props;
  const classes = useStyles();
  const allTokens = useAllTokens();
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
    <div className={classes.swap_container}>
      <div className={classes.swap_header}>
        <div className={[classes.swap_header_item, classes.swap_header_item_active].join(" ")}>CONFIRM SWAP</div>
      </div>
      <div className={classes.swap_form_container}>
        <small
          style={{
            display: "block",
            whiteSpace: "nowrap",
            overflowX: "scroll",
          }}
        >
          <code>
            {"  "}
            <b>Product:</b> {swap?.toToken.symbol}
          </code>
          <br />
          <code>
            <span title={swapStats.toTokenQuantity}>
              <b>Quantity:</b> {+swapStats.toTokenQuantity}
            </span>
          </code>
          <br />
          <code>
            <span title={swapStats.rate}>
              × <b>Rate:</b> {+swapStats.rate}
            </span>{" "}
            {swap?.fromToken.symbol}/{swap?.toToken.symbol}
          </code>
          <br />
          <code>
            + <b>Gas Price:</b> <LoadingText text={swapStats.gasPrice} /> GWEI
          </code>
          <br />
          <code>
            × <b>Gas:</b> <LoadingText text={swap?.tx.gas.toString()} />
          </code>
          <br />
          <hr />
          <code>
            <b> COST:</b> {swapStats.fromTokenQuantity} {swap?.fromToken.symbol} (
            <CoinPriceUSD token={fromToken} tokenQuantity={swapStats.fromTokenQuantity} />)
          </code>
          <br />
          <code>
            <b>{"+"} FEE:</b> <LoadingText text={swapStats.fee} /> ETH (
            <CoinPriceUSD token={ethToken} tokenQuantity={swapStats.fee} />)
          </code>
          <br />
          <hr />
          <code>
            <b>TOTAL:</b> ≈$
            <LoadingText text={totalInUSD} />
          </code>
        </small>
        <br />
        <br />
        <div className={classes.button_group}>
          <button onClick={() => deny()} className={[classes.button, classes.button_light].join(" ")}>
            Cancel
          </button>
          <button onClick={() => confirm()} className={classes.button}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
