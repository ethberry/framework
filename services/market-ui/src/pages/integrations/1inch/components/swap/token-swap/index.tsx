import { ChangeEvent, FC, useEffect, useMemo, useRef } from "react";
import { Grid, TextField, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";

import { GovernanceTokenAddress, IToken } from "@gemunion/provider-1inch";

import { safeParseUnits } from "../../../helpers/safeParseUnits";
import { useGasPrice } from "../../../hooks/useGasPrice";
import { useDebounce } from "../../../hooks/useDebounce";
import { CoinPriceUSD } from "../../CoinPriceUSD";
import { TokenButton } from "../token-button";

export interface ISwapTokenProps {
  token: IToken;
  quantity: string;
  setQuantity?: (quantity: string) => void;
  readonly?: boolean;
  onClickToChangeToken: () => void;
  loading?: boolean;
  walletBalance?: string;
  hasBalance: boolean;
}

export const SwapToken: FC<ISwapTokenProps> = props => {
  const { token, quantity, setQuantity, readonly, onClickToChangeToken, loading, walletBalance, hasBalance } = props;

  const [localQuantity, setLocalQuantity, immediateLocalQuantity] = useDebounce<string>(quantity, 450);

  const gasPrice = useGasPrice();
  const { maxSpend } = useMemo<{
    maxSpend: string;
    isEqualToMaxSpend: boolean;
    isGreaterThanMaxSpend: boolean;
  }>(() => {
    if (
      !token ||
      !walletBalance ||
      (token?.address === GovernanceTokenAddress && !gasPrice) ||
      !hasBalance ||
      !walletBalance
    ) {
      return {
        maxSpend: "0",
        isEqualToMaxSpend: false,
        isGreaterThanMaxSpend: false,
      };
    }
    const parsedQuantity = safeParseUnits((immediateLocalQuantity || "0") + "", token);
    const parsedBalance = safeParseUnits(walletBalance || "0", token);
    let maxSpendParsed = BigNumber.from(parsedBalance);
    if (token?.address === GovernanceTokenAddress) {
      const approxGasUsage = 310400;
      const etherTxFee = parseUnits(gasPrice, "gwei").mul(BigNumber.from(approxGasUsage));
      maxSpendParsed = parsedBalance.sub(etherTxFee);
      if (maxSpendParsed.lte(BigNumber.from(0))) {
        maxSpendParsed = BigNumber.from(0);
      }
    }
    const maxSpendFormatted = formatUnits(BigNumber.from(maxSpendParsed), BigNumber.from(token.decimals));
    return {
      isEqualToMaxSpend: parsedQuantity.eq(maxSpendParsed),
      isGreaterThanMaxSpend: parsedQuantity.gt(maxSpendParsed),
      maxSpend: maxSpendFormatted,
    };
  }, [gasPrice, token?.symbol, walletBalance, immediateLocalQuantity]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.currentTarget.value;
    try {
      const expectedFormat = formatUnits(safeParseUnits(val, token), token?.decimals);

      if (+expectedFormat !== +val) {
        e.currentTarget.value = expectedFormat;
        val = expectedFormat;
      }
    } catch (e) {}

    if (val !== undefined) {
      setLocalQuantity(val || "0");
    }
  };

  useEffect(() => {
    if (setQuantity) {
      setQuantity(localQuantity);
    }
  }, [localQuantity]);

  useEffect(() => {
    if (quantity !== localQuantity) {
      setLocalQuantity(quantity);
    }
  }, [quantity]);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Grid container columnSpacing={2}>
      <Grid item xs={6} style={{ display: "flex" }}>
        <TokenButton onClick={onClickToChangeToken} token={token} />
      </Grid>
      <Grid item xs={6}>
        <TextField
          InputProps={{
            readOnly: readonly,
            inputProps: {
              min: 0,
              max: maxSpend || Infinity,
              step: "any",
            },
          }}
          ref={inputRef}
          value={immediateLocalQuantity || ""}
          required
          autoFocus
          onChange={handleChange}
          type="number"
          placeholder={loading ? "loading..." : "1.32009"}
          fullWidth
        />
      </Grid>

      <Grid item xs={6} textAlign="center">
        <Typography style={{ textAlign: "center" }}>{token?.name}</Typography>
      </Grid>
      <Grid item xs={6} textAlign="center">
        <CoinPriceUSD token={token} tokenQuantity={quantity} />
      </Grid>
    </Grid>
  );
};
