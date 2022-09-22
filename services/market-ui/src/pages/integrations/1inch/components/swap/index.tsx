import { FC, FormEvent, useEffect, useState } from "react";
import { Box, Button, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";

import { GovernanceTokenAddress, stableCoinSymbol, useOneInch, IToken, SwapStatus } from "@gemunion/provider-1inch";
import { useWallet } from "@gemunion/provider-wallet";

import { useAllTokens } from "../../hooks/useAllTokens";
import { useGasPrice } from "../../hooks/useGasPrice";
import { useQuote } from "../../hooks/useQuote";
import { useSwap } from "../../hooks/useSwap";

import { TokenSearchDialog } from "../token-search";
import { SwapToken } from "./token-swap";
import { LoadingText } from "../LoadingText";
import { SwapStageConfirm } from "../SwapStageConfirm";
import { useWalletTokens } from "../../hooks/useWalletTokens";
import { useTokenBalances } from "../../hooks/useTokenBalances";

import { CoinPriceUSD } from "../CoinPriceUSD";
import { TokenButton } from "./token-button";
import { SwapHeader } from "./header";
import { useStyles } from "./styles";

export const Swap: FC = () => {
  const tokens = useAllTokens();
  const defaultFromToken = tokens.find(token => token.address === GovernanceTokenAddress);
  const defaultToToken = tokens.find(token => token.address === stableCoinSymbol);

  const [fromToken, setFromToken] = useState<IToken>(defaultFromToken!);
  const [toToken, setToToken] = useState<IToken>(defaultToToken!);
  const [quantity, setQuantity] = useState<string>("1");
  const [output, setOutput] = useState<string>("");
  const gasPrice = useGasPrice();
  const quote = useQuote(quantity, fromToken, toToken);
  const web3 = useWeb3React();
  const oneInch = useOneInch();
  const { openConnectWalletDialog } = useWallet();

  const [searchState, setSearchState] = useState<{
    onSelect: typeof setFromToken | typeof setToToken;
    isVisible: boolean;
    filter: (t: IToken) => boolean;
  }>({
    onSelect: () => {},
    isVisible: false,
    filter: () => false,
  });
  const swapState = useSwap(quantity, fromToken, toToken, oneInch);
  const walletTokens = useWalletTokens();
  const walletTokenBalances = useTokenBalances(walletTokens);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  useEffect(() => {
    if (quote) {
      setOutput(formatUnits(BigNumber.from(quote.toTokenAmount), BigNumber.from(quote.toToken.decimals)));
    } else {
      setOutput("");
    }
  }, [quote?.toTokenAmount, quote?.toToken.decimals]);

  useEffect(() => {
    if (!fromToken && !toToken && tokens.length) {
      setFromToken(tokens.find(token => token.address === GovernanceTokenAddress)!);
      setToToken(tokens.find(token => token.symbol === stableCoinSymbol)!);
    }
  }, [fromToken, toToken, tokens]);

  useEffect(() => {
    // todo get all tokens
    // todo set toToken to `stableCoinSymbol`
  }, [oneInch.getNetwork()]);

  if (swapState.status === SwapStatus.PREPARING_TX) {
    return (
      <div className={classes.swap_container}>
        <div className={classes.swap_header}>
          <div className={[classes.swap_header_item, classes.swap_header_item_active].join(" ")}>PREPARING SWAP</div>
        </div>
        <CircularProgress />
      </div>
    );
  }

  if (swapState.status === SwapStatus.AWAITING_CONFIRMATION) {
    return (
      <SwapStageConfirm
        swap={swapState.data}
        fromToken={fromToken}
        confirm={swapState.confirmSwap}
        deny={swapState.denySwap}
      />
    );
  }

  if (swapState.status === SwapStatus.AWAITING_APPROVAL || swapState.status === SwapStatus.AWAITING_APPROVE_TX) {
    return (
      <div className={classes.swap_container}>
        <div className={classes.swap_header}>
          <div className={[classes.swap_header_item, classes.swap_header_item_active].join(" ")}>
            {swapState.status === SwapStatus.AWAITING_APPROVAL
              ? "APPROVE"
              : swapState.status === SwapStatus.AWAITING_APPROVE_TX
              ? "APPROVING..."
              : ""}
          </div>
        </div>
      </div>
    );
  }

  if (swapState.status === SwapStatus.SENDING_TX) {
    return (
      <div className={classes.swap_container}>
        <div className={classes.swap_header}>
          <div className={[classes.swap_header_item, classes.swap_header_item_active].join(" ")}>SWAPPING TOKENS</div>
        </div>
      </div>
    );
  }

  if (swapState.status === SwapStatus.COMPLETE) {
    return (
      <div className={classes.swap_container}>
        <div className={classes.swap_header}>
          <div className={[classes.swap_header_item, classes.swap_header_item_active].join(" ")}>COMPLETE</div>
        </div>
        <div className={classes.button_group}>
          <button onClick={() => swapState.reset()} className={classes.button}>
            Swap Again
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!web3.account) {
      return;
    }
    if (+quantity > +(walletTokenBalances[fromToken.address] || 0)) {
      enqueueSnackbar(`Insufficient ${fromToken.symbol} balance`, { variant: "error" });
      return;
    }
    if (fromToken.address === toToken.address) {
      enqueueSnackbar(`Tokens cannot be the same`, { variant: "error" });
      return;
    }
    await swapState.execute();
  };

  return (
    <Paper
      elevation={3}
      component="form"
      onInvalid={() => {
        enqueueSnackbar("Insufficient funds", { variant: "error" });
      }}
      onSubmit={handleSubmit}
      className={classes.container}
    >
      <SwapHeader onReset={() => swapState.reset()} />

      <Paper elevation={3} className={classes.paper}>
        <SwapToken
          hasBalance={!!walletTokens.find(token => token.address === fromToken?.address)}
          onClickToChangeToken={() => {
            setSearchState({
              isVisible: true,
              onSelect: token => {
                setQuantity("1");
                setFromToken(token);
              },
              filter: () => true,
            });
          }}
          quantity={quantity}
          setQuantity={setQuantity}
          token={fromToken}
          walletBalance={walletTokenBalances[fromToken?.address]}
        />
      </Paper>

      <Box display="flex" p={2}>
        <ArrowDownward style={{ alignSelf: "center", flex: "auto" }} />
      </Box>

      <Paper elevation={3} className={classes.paper}>
        <Grid item style={{ height: 56, display: "flex" }}>
          <TokenButton
            onClick={() => {
              setSearchState({
                isVisible: true,
                onSelect: t => {
                  setToToken(t);
                },
                filter: t => t.address !== fromToken.address,
              });
            }}
            token={toToken}
          />
        </Grid>
        <br />
        <Paper className={classes.paper}>
          <Grid container>
            <Grid item xs={6}>
              <Typography>1inch</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{output}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Tx cost Ξ{quote?.estimatedGas}</Typography>
            </Grid>
            <Grid item xs={6}>
              <CoinPriceUSD token={toToken} tokenQuantity={output} />
            </Grid>
          </Grid>
        </Paper>
      </Paper>

      <div className={classes.swap_form_token_dex_info_container}>
        <div className={classes.swap_form_token_dex_info_title}>Spread across DEXes</div>
        <div className={classes.swap_form_token_dex_info_toggle}>
          <div className={classes.swap_form_token_dex_info_toggle_action_text}>
            <LoadingText text={quote?.protocols.length} /> Selected
          </div>
        </div>
      </div>

      {!web3.isActive ? (
        <Button
          onClick={() => {
            void openConnectWalletDialog();
          }}
          type="button"
          color="secondary"
          variant="contained"
          size="large"
          fullWidth
        >
          <FormattedMessage id="pages.1inch.buttons.connect-wallet" />
        </Button>
      ) : (
        <Button type="submit" color="primary" variant="contained" size="large" fullWidth>
          <FormattedMessage id="pages.1inch.buttons.swap-tokens" />
        </Button>
      )}

      <div className={classes.swap_form_meta_container}>
        <div>Max price slippage: {oneInch.getSlippage()}</div>
        <div>Gas price: {~~+gasPrice} GWEI</div>
      </div>

      <TokenSearchDialog
        open={searchState.isVisible}
        filter={searchState.filter}
        onClose={() => {
          setSearchState({
            isVisible: false,
            onSelect: () => {},
            filter: () => true,
          });
        }}
        onSelect={t => {
          searchState.onSelect(t);
        }}
      />
    </Paper>
  );
};
