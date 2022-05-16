import { FC, useContext, useEffect, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { AccountBalanceWallet, Redeem } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar } from "notistack";
import { ethers } from "ethers";

import { ApiContext, ApiError } from "@gemunion/provider-api";
import { WalletContext } from "@gemunion/provider-wallet";
import { Spinner } from "@gemunion/mui-page-layout";
import { useMetamask } from "@gemunion/react-hooks";
import { IErc20Vesting } from "@framework/types";

import CliffVesting from "@framework/binance-contracts/artifacts/contracts/Vesting/CliffVesting.sol/CliffVesting.json";

export const Erc20Vesting: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [vesting, setVesting] = useState<IErc20Vesting | null>(null);

  const { library, active, account } = useWeb3React();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const wallet = useContext(WalletContext);
  const api = useContext(ApiContext);

  const fetchDropbox = async (): Promise<void> => {
    if (!active) {
      return;
    }

    setIsLoading(true);
    return api
      .fetchJson({
        url: `/erc20-vesting/${account as string}`,
      })
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const metaClick = useMetamask((vesting: IErc20Vesting) => {
    const contract = new ethers.Contract(vesting.address, CliffVesting.abi, library.getSigner());

    return contract.release(vesting.token) as Promise<void>;
  });

  const handleClick = (vesting: IErc20Vesting) => {
    return () => {
      return metaClick(vesting);
    };
  };

  const handleOpenConnectWalletDialog = () => {
    wallet.setWalletConnectDialogOpen(true);
  };

  useEffect(() => {
    void fetchDropbox();
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
    return (
      <Tooltip title={formatMessage({ id: "form.tips.redeem" })} enterDelay={300}>
        <IconButton color="inherit" onClick={handleClick(vesting)}>
          <Redeem />
        </IconButton>
      </Tooltip>
    );
  }

  return <FormattedMessage id="pages.erc20-vesting.sorry" />;
};
