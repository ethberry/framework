import { FC, Fragment, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";

import { useWallet } from "@gemunion/provider-wallet";

export const WalletWrapper: FC = () => {
  const { isActive } = useWeb3React();

  const { openConnectWalletDialog, closeConnectWalletDialog } = useWallet();

  useEffect(() => {
    if (!isActive) {
      void openConnectWalletDialog();
    } else {
      void closeConnectWalletDialog();
    }
  }, [isActive]);

  if (isActive) {
    return <Outlet />;
  }

  return (
    <Fragment>
      <Alert severity="error">
        <FormattedMessage id="snackbar.walletIsNotConnected" />
      </Alert>
    </Fragment>
  );
};
