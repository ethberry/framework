import { FC, Fragment, useEffect, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { AccountBalanceWallet, Redeem } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar } from "notistack";
import { Contract } from "ethers";

import { ApiError } from "@gemunion/provider-api-firebase";
import { useApiCall } from "@gemunion/react-hooks";
import { useWallet } from "@gemunion/provider-wallet";
import { IPaginationResult } from "@gemunion/types-collection";
import { Spinner } from "@gemunion/mui-page-layout";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { AirdropStatus, IAirdrop } from "@framework/types";

import ERC721AirdropSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Airdrop.sol/ERC721Airdrop.json";

export const Airdrop: FC = () => {
  const [airdrops, setAirdrops] = useState<Array<IAirdrop>>([]);

  const { library, active, account } = useWeb3React();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const { openConnectWalletDialog } = useWallet();

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/erc721-airdrop`,
        data: {
          query: account,
        },
      });
    },
    { success: false, error: false },
  );

  const fetchDropbox = async (): Promise<void> => {
    if (!active) {
      return;
    }

    return fn()
      .then((json: IPaginationResult<IAirdrop>) => {
        setAirdrops(json.rows);
      })
      .catch((e: ApiError) => {
        if (e.status === 404) {
          setAirdrops([]);
        } else if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };

  const metaClick = useMetamask((airdrop: IAirdrop) => {
    const contract = new Contract(process.env.ERC721_AIRDROP_ADDR, ERC721AirdropSol.abi, library.getSigner());

    return contract.redeem(account, airdrop.id, airdrop.item, process.env.ACCOUNT, airdrop.signature) as Promise<void>;
  });

  const handleClick = (airdrop: IAirdrop) => {
    return () => {
      return metaClick(airdrop);
    };
  };

  const handleOpenConnectWalletDialog = () => {
    openConnectWalletDialog();
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

  if (airdrops.length) {
    return (
      <Fragment>
        {airdrops.map(airdrop => (
          <Tooltip title={formatMessage({ id: "form.tips.redeem" })} enterDelay={300} key={airdrop.id}>
            <IconButton
              color="inherit"
              onClick={handleClick(airdrop)}
              disabled={airdrop.airdropStatus !== AirdropStatus.NEW}
            >
              <Redeem />
            </IconButton>
          </Tooltip>
        ))}
      </Fragment>
    );
  }

  return <FormattedMessage id="pages.erc721-airdrop.sorry" />;
};
