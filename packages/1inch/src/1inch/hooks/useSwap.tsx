import { useState } from "react";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { Web3ContextType } from "@web3-react/core";
import { BigNumber, Contract, ContractTransaction, ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";

import { GovernanceTokenAddress, IOneInchContext, ISwap, IToken, SwapStatus } from "../provider";
import { useMetamask } from "@gemunion/react-hooks-eth";

import AllowanceABI from "./allowance.abi.json";

import { repeatOnFail } from "../helpers/repeatOnFail";
import { safeParseUnits } from "../helpers/safeParseUnits";

export const waitForTx = async (txHash: string, provider: ethers.providers.Web3Provider): Promise<void> => {
  while (true) {
    const receipt = await provider.getTransactionReceipt(txHash);
    if (receipt) {
      break;
    } else {
      console.info({ receipt });
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
};

export const approve = async (
  parsedAmountFromToken: BigNumber,
  fromToken: IToken,
  provider: ethers.providers.Web3Provider,
  api: IOneInchContext,
): Promise<ContractTransaction | void> => {
  const signer = provider.getSigner();
  const erc20Contract = new Contract(fromToken.address, AllowanceABI, signer);

  const { address: spenderAddress } = await api.approveSpender();

  const allowance = await erc20Contract.allowance(await signer.getAddress(), spenderAddress);

  if (allowance.gte(parsedAmountFromToken)) {
    return;
  }

  return erc20Contract.approve(spenderAddress, parsedAmountFromToken) as Promise<ContractTransaction | void>;
};

export const useSwap = (
  amountToSend: string,
  fromToken: IToken,
  toToken: IToken,
  api: IOneInchContext,
): {
  status: SwapStatus;
  data: ISwap | null;
  execute: () => Promise<void>;
  confirmSwap: () => void;
  denySwap: () => void;
  reset: () => void;
} => {
  const [swapStatus, setSwapStatus] = useState<SwapStatus>(SwapStatus.DORMANT);
  const [data, setData] = useState<ISwap | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const [confirmState, setConfirmState] = useState<{
    confirm: () => void;
    deny: () => void;
  }>({
    confirm: () => {},
    deny: () => {},
  });

  const reset = (): void => {
    setData(null);
    setSwapStatus(SwapStatus.DORMANT);
    setConfirmState({
      confirm: () => {},
      deny: () => {},
    });
  };

  const execute = useMetamask(
    async (_, web3Context: Web3ContextType) => {
      const signer = web3Context.provider!.getSigner();
      try {
        // Activate
        const parsedAmountFromToken = safeParseUnits(amountToSend, fromToken);

        // Approve
        if (fromToken.address !== GovernanceTokenAddress) {
          try {
            setSwapStatus(SwapStatus.AWAITING_APPROVAL);
            enqueueSnackbar(
              formatMessage(
                { id: "pages.1inch.snackbar.approve-1inch" },
                fromToken as unknown as Record<string, string>,
              ),
              {
                variant: "info",
                action: () => (
                  <Button
                    href="https://help.1inch.exchange/en/articles/4585113-why-do-i-need-to-approve-my-tokens-before-a-trade"
                    target="_blank"
                  >
                    <FormattedMessage id="pages.1inch.buttons.learn-more" />
                  </Button>
                ),
              },
            );
            // Give users time to read the message
            await new Promise(resolve => setTimeout(resolve, 2000));

            const tx = await approve(parsedAmountFromToken, fromToken, web3Context.provider!, api);
            setSwapStatus(SwapStatus.AWAITING_APPROVE_TX);
            if (tx) {
              await waitForTx(tx.hash, web3Context.provider!);
            }
            enqueueSnackbar("Approved!", { variant: "success" });
          } catch (e) {
            enqueueSnackbar("Approval denied. Swap cancelled.", { variant: "error" });
            console.error(e);
            throw e;
          }
        }
        setSwapStatus(SwapStatus.PREPARING_TX);

        const swap = await repeatOnFail(
          async () => api.swap(fromToken, toToken, parsedAmountFromToken.toString(), web3Context.account!, 1),
          {
            iterations: 10,
            waitFor: 1000,
            waitForMultiplier: 1.5,
          },
        );
        // Add error toast here
        setData(swap);

        setSwapStatus(SwapStatus.AWAITING_CONFIRMATION);
        let denied = false;
        await new Promise((resolve, reject) => {
          setConfirmState({ confirm: () => resolve(void 0), deny: reject });
        }).catch(() => {
          enqueueSnackbar("Swap cancelled", { variant: "warning" });
          denied = true;
        });
        if (denied) {
          reset();
          return;
        }

        enqueueSnackbar("Swap confirmed!", { variant: "success" });

        setTimeout(() => enqueueSnackbar("Please wait while 1inch swaps your tokens", { variant: "info" }), 1000);
        setSwapStatus(SwapStatus.SENDING_TX);
        // Swap
        const { from, to, data, value } = swap.tx;

        const tx = await signer.sendTransaction({
          from,
          to,
          data,
          value: BigNumber.from(value),
        });
        await waitForTx(tx.hash, web3Context.provider!);
        enqueueSnackbar("Swap complete!", { variant: "success" });

        setTimeout(
          () =>
            enqueueSnackbar(
              `Converted ${formatUnits(swap.fromTokenAmount, swap.fromToken.decimals)} ${
                swap.fromToken.symbol
              } to ${formatUnits(swap.toTokenAmount, swap.toToken.decimals)} ${swap.toToken.symbol}`,
              { variant: "success" },
            ),
          1000,
        );
        setSwapStatus(SwapStatus.COMPLETE);
      } catch (e) {
        setSwapStatus(SwapStatus.ERROR);
        console.error(e);
      }
    },
    { success: false },
  );

  return {
    execute,
    data,
    status: swapStatus,
    confirmSwap: confirmState.confirm,
    denySwap: confirmState.deny,
    reset,
  };
};
