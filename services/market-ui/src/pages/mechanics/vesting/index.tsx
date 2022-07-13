import { FC, useEffect, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { AccountBalanceWallet } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar } from "notistack";

import { ApiError } from "@gemunion/provider-api-firebase";
import { useApiCall } from "@gemunion/react-hooks";
import { useWallet } from "@gemunion/provider-wallet";
import { Spinner } from "@gemunion/mui-page-layout";
import { IVesting } from "@framework/types";

import { VestingReleaseButton } from "../../../components/buttons";

export const Vesting: FC = () => {
  const [vesting, setVesting] = useState<IVesting | null>(null);

  const { isActive, account } = useWeb3React();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const { openConnectWalletDialog } = useWallet();

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/vesting/${account as string}`,
      });
    },
    { success: false, error: false },
  );

  const fetchVesting = async (): Promise<void> => {
    if (!isActive) {
      return;
    }

    return fn()
      .then((json: IVesting) => {
        setVesting(json);
      })
      .catch((e: ApiError) => {
        if (e.status === 404) {
          setVesting(null);
        } else if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };

  const handleOpenConnectWalletDialog = () => {
    openConnectWalletDialog();
  };

  useEffect(() => {
    void fetchVesting();
  }, [isActive, account]);

  if (!isActive) {
    return (
      <Tooltip title={formatMessage({ id: "components.header.wallet.connect" })} enterDelay={300}>
        <IconButton color="inherit" onClick={handleOpenConnectWalletDialog}>
          <AccountBalanceWallet />
        </IconButton>
      </Tooltip>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (vesting) {
    return <VestingReleaseButton vesting={vesting} />;
  }

  return <FormattedMessage id="pages.vesting.sorry" />;
};
