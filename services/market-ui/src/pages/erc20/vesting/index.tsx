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
import { IErc20Vesting } from "@framework/types";

import { VestingReleaseButton } from "../../../components/buttons";

export const Erc20Vesting: FC = () => {
  const [vesting, setVesting] = useState<IErc20Vesting | null>(null);

  const { active, account } = useWeb3React();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const { openConnectWalletDialog } = useWallet();

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/erc20-vesting/${account as string}`,
      });
    },
    { success: false, error: false },
  );

  const fetchVesting = async (): Promise<void> => {
    if (!active) {
      return;
    }

    return fn()
      .then((json: IErc20Vesting) => {
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
  }, [active, account]);

  if (!active) {
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

  return <FormattedMessage id="pages.erc20-vesting.sorry" />;
};
