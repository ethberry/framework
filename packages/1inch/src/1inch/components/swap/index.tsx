import { FC, FormEvent, memo, useEffect, useState } from "react";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";

import { useWallet } from "@gemunion/provider-wallet";

import { GovernanceTokenAddress, stableCoinSymbol, useOneInch, IToken, SwapStatus } from "../../provider";
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

import { TokenButton } from "./token-button";
import { SwapHeader } from "./header";

import {
  StyledButton,
  StyledButtonGroup,
  StyledPaper,
  StyledPaperContainer,
  StyledSwapContainer,
  StyledSwapFormDexInfoContainer,
  StyledSwapFormDexInfoTitle,
  StyledSwapFormDexInfoToggle,
  StyledSwapFormDexInfoToggleActionText,
  StyledSwapFormMetaContainer,
  StyledSwapHeader,
  StyledSwapHeaderItem,
} from "./styled";

export const Swap: FC = memo(() => {
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
  const { formatMessage } = useIntl();

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
      <StyledSwapContainer>
        <StyledSwapHeader>
          <StyledSwapHeaderItem>{formatMessage({ id: "pages.1inch.swap.preparing" })}</StyledSwapHeaderItem>
        </StyledSwapHeader>
        <CircularProgress />
      </StyledSwapContainer>
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
      <StyledSwapContainer>
        <StyledSwapHeader>
          <StyledSwapHeaderItem>
            {swapState.status === SwapStatus.AWAITING_APPROVAL
              ? formatMessage({ id: "pages.1inch.swap.approve" })
              : swapState.status === SwapStatus.AWAITING_APPROVE_TX
              ? formatMessage({ id: "pages.1inch.swap.approving" })
              : ""}
          </StyledSwapHeaderItem>
        </StyledSwapHeader>
      </StyledSwapContainer>
    );
  }

  if (swapState.status === SwapStatus.SENDING_TX) {
    return (
      <StyledSwapContainer>
        <StyledSwapHeader>
          <StyledSwapHeaderItem>{formatMessage({ id: "pages.1inch.swap.swapping" })}</StyledSwapHeaderItem>
        </StyledSwapHeader>
      </StyledSwapContainer>
    );
  }

  if (swapState.status === SwapStatus.COMPLETE) {
    return (
      <StyledSwapContainer>
        <StyledSwapHeader>
          <StyledSwapHeaderItem>{formatMessage({ id: "pages.1inch.swap.complete" })}</StyledSwapHeaderItem>
        </StyledSwapHeader>
        <StyledButtonGroup>
          <StyledButton onClick={() => swapState.reset()}>
            {formatMessage({ id: "pages.1inch.buttons.swapAgain" })}
          </StyledButton>
        </StyledButtonGroup>
      </StyledSwapContainer>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!web3.account) {
      return;
    }
    if (+quantity > +(walletTokenBalances[fromToken.address] || 0)) {
      enqueueSnackbar(formatMessage({ id: "pages.1inch.warning.insufficient" }, { symbol: fromToken.symbol }), {
        variant: "error",
      });
      return;
    }
    if (fromToken.address === toToken.address) {
      enqueueSnackbar(formatMessage({ id: "pages.1inch.warning.cannotBeSame" }), { variant: "error" });
      return;
    }
    await swapState.execute();
  };

  return (
    <StyledPaperContainer
      elevation={3}
      onInvalid={() => {
        enqueueSnackbar("Insufficient funds", { variant: "error" });
      }}
      onSubmit={handleSubmit}
      component="form"
    >
      <SwapHeader onReset={() => swapState.reset()} />

      <StyledPaper elevation={3}>
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
      </StyledPaper>

      <Box display="flex" p={2}>
        <ArrowDownward style={{ alignSelf: "center", flex: "auto" }} />
      </Box>

      <StyledPaper elevation={3}>
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
        <StyledPaper>
          <Grid container>
            <Grid item xs={6}>
              <Typography>
                {fromToken?.symbol} {formatMessage({ id: "pages.1inch.swap.buyPrice" })}
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Typography>
                {(+output).toFixed(5)} {toToken?.symbol}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{formatMessage({ id: "pages.1inch.swap.txCost" })}</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              {quote ? `$ ${(quote.estimatedGas * 0.000001).toFixed(5)}` : null}
            </Grid>
          </Grid>
        </StyledPaper>
      </StyledPaper>

      <StyledSwapFormDexInfoContainer>
        <StyledSwapFormDexInfoTitle>{formatMessage({ id: "pages.1inch.swap.spread" })}</StyledSwapFormDexInfoTitle>
        <StyledSwapFormDexInfoToggle>
          <StyledSwapFormDexInfoToggleActionText>
            <LoadingText text={quote?.protocols.length} /> {formatMessage({ id: "pages.1inch.swap.selected" })}
          </StyledSwapFormDexInfoToggleActionText>
        </StyledSwapFormDexInfoToggle>
      </StyledSwapFormDexInfoContainer>

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

      <StyledSwapFormMetaContainer>
        <Box>
          {formatMessage({ id: "pages.1inch.swap.maxPriceSlippage" })}: {oneInch.getSlippage()}
        </Box>
        <Box>
          {formatMessage({ id: "pages.1inch.swap.gasPrice" })}: {~~+gasPrice}{" "}
          {formatMessage({ id: "pages.1inch.swap.gwei" })}
        </Box>
      </StyledSwapFormMetaContainer>

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
    </StyledPaperContainer>
  );
});
