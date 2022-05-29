import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import { useWallet } from "@gemunion/provider-wallet";

export const useEnsureWallet = <T = any>(fn: (...args: Array<any>) => Promise<T>) => {
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

    return fn(...args);
  };
};
