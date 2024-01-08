import { enqueueSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { ErrorCode } from "@ethersproject/logger";
import { RESERVED_ERROR_CODES, SERVER_ERROR_CODE_RANGE, STANDARD_ERROR_MAP } from "@json-rpc-tools/utils";

import { downForMaintenance } from "@gemunion/license-messages";
import { useLicense } from "@gemunion/provider-license";
import { useWallet } from "@gemunion/provider-wallet";
import { useAppSelector } from "@gemunion/redux";

import { IHandlerOptionsParams } from "./interfaces";
import { BlockchainErrorType, parseBlockchainError } from "./error-handler";

export const useMetamaskWallet = <T = any>(
  fn: (...args: Array<any>) => Promise<T>,
  options: IHandlerOptionsParams = {},
) => {
  const license = useLicense();

  const web3ContextGlobal = useWeb3React();
  const { isActive } = web3ContextGlobal;
  const { openConnectWalletDialog, closeConnectWalletDialog } = useWallet();
  const { isDialogOpen } = useAppSelector(state => state.wallet);

  const { formatMessage } = useIntl();
  const { success = true, error = true } = options;

  return async (...args: Array<any>): Promise<T> => {
    if (!license.isValid()) {
      return Promise.reject(downForMaintenance()).catch((e: string) => {
        enqueueSnackbar(e, { variant: "error" });
        return null as unknown as T;
      });
    }

    let context = web3ContextGlobal;

    if (!isActive) {
      context = await openConnectWalletDialog();
    } else if (isDialogOpen) {
      closeConnectWalletDialog();
    }

    return fn(...args, context)
      .then((transaction: any) => {
        if (success && transaction !== null) {
          enqueueSnackbar(formatMessage({ id: "snackbar.transactionSent" }, { txHash: transaction.hash }), {
            variant: "info",
          });
        }
        return transaction as T;
      })
      .catch((e: any) => {
        if (error && e.status !== 400) {
          if (e.code === 4001 || e.code === ErrorCode.ACTION_REJECTED) {
            enqueueSnackbar(formatMessage({ id: "snackbar.rejectedByUser" }), { variant: "warning" });
          } else if ([...SERVER_ERROR_CODE_RANGE, ...RESERVED_ERROR_CODES].includes(e.code)) {
            enqueueSnackbar(formatMessage({ id: "snackbar.blockchainError" }), { variant: "error" });
            const errorType = Object.values(STANDARD_ERROR_MAP).find(({ code }) => code === e.code)?.message;
            console.error(`[blockchain error]${errorType ? ` [${errorType}]` : ""}`, e.message);
          } else {
            if (e.error?.data?.data) {
              const errorData = e.error?.data?.data as string;
              const errorReason = parseBlockchainError(errorData);
              enqueueSnackbar(
                errorReason.type === BlockchainErrorType.CUSTOM_ERROR
                  ? formatMessage({
                      id: `enums.blockchainError.${errorReason.reason}`,
                    })
                  : formatMessage(
                      {
                        id: "snackbar.blockchainErrorReason",
                      },
                      {
                        reason:
                          errorReason.reason.includes(":") || errorReason.reason.includes(" ")
                            ? errorReason.reason
                            : "",
                      },
                    ),
                { variant: "error" },
              );
              console.error("[blockchain error]", errorReason);
            } else {
              enqueueSnackbar(formatMessage({ id: "snackbar.blockchainError" }), { variant: "error" });
              console.error("[blockchain error]", e);
            }
          }
          return null;
        }

        throw e;
      }) as Promise<T>;
  };
};
