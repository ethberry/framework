import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import { useWallet } from "@gemunion/provider-wallet";

export const useMetamaskValue = <T = any>(fn: (...args: Array<any>) => Promise<T>) => {
  const { active } = useWeb3React();

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const { openConnectWalletDialog } = useWallet();

  return async (...args: Array<any>) => {
    if (!active) {
      openConnectWalletDialog();
      enqueueSnackbar(formatMessage({ id: "snackbar.walletIsNotConnected" }), { variant: "error" });
      return;
    }

    return fn(...args)
      .then((result: T) => {
        enqueueSnackbar(formatMessage({ id: "snackbar.success" }), { variant: "success" });
        return result;
      })
      .catch((error: any) => {
        if (error.code === 4001) {
          enqueueSnackbar(formatMessage({ id: "snackbar.denied" }), { variant: "warning" });
        } else {
          console.error(error);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };
};
