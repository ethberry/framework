import { FC, Fragment, useEffect, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { AccountBalanceWallet, Redeem } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar } from "notistack";
import { Contract } from "ethers";

import { ApiError, useApi } from "@gemunion/provider-api";
import { useWallet } from "@gemunion/provider-wallet";
import { IPaginationResult } from "@gemunion/types-collection";
import { Spinner } from "@gemunion/mui-page-layout";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { Erc721AirdropStatus, IErc721Airdrop } from "@framework/types";

import ERC721Airdrop from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Airdrop.sol/ERC721Airdrop.json";

export const Erc721Airdrop: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [airdrops, setAirdrops] = useState<Array<IErc721Airdrop>>([]);

  const { library, active, account } = useWeb3React();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const { openConnectWalletDialog } = useWallet();

  const api = useApi();

  const fetchDropbox = async (): Promise<void> => {
    if (!active) {
      return;
    }

    setIsLoading(true);
    return api
      .fetchJson({
        url: `/erc721-airdrop`,
        data: {
          query: account,
        },
      })
      .then((json: IPaginationResult<IErc721Airdrop>) => {
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const metaClick = useMetamask((airdrop: IErc721Airdrop) => {
    const contract = new Contract(process.env.ERC721_AIRDROP_ADDR, ERC721Airdrop.abi, library.getSigner());

    return contract.redeem(
      account,
      airdrop.id,
      airdrop.erc721TemplateId,
      process.env.ACCOUNT,
      airdrop.signature,
    ) as Promise<void>;
  });

  const handleClick = (airdrop: IErc721Airdrop) => {
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
              disabled={airdrop.airdropStatus !== Erc721AirdropStatus.NEW}
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
