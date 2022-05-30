import { FC, useState } from "react";
import { Button } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { constants } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { useSnackbar } from "notistack";

import { useWallet } from "@gemunion/provider-wallet";
import { IErc721Token } from "@framework/types";

import { Erc721TokenAuctionDialog, IErc721SellOptions } from "./auction";
import { useSeaport } from "../../../providers/seaport";

interface IErc721TokenAuctionButtonProps {
  token: IErc721Token;
}

export const Erc721TokenAuctionButton: FC<IErc721TokenAuctionButtonProps> = props => {
  const { token } = props;
  const [isAuctionDialogOpen, setIsAuctionDialogOpen] = useState(false);

  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const { account } = useWeb3React();
  const { openConnectWalletDialog } = useWallet();
  const seaport = useSeaport();

  const handleAuction = (): void => {
    setIsAuctionDialogOpen(true);
  };

  const handleAuctionConfirmed = async (values: IErc721SellOptions) => {
    if (!account) {
      openConnectWalletDialog();
      enqueueSnackbar(formatMessage({ id: "snackbar.walletIsNotConnected" }), { variant: "error" });
      return;
    }

    await seaport.sellErc721ForErc20(
      {
        startDate: values.startDate,
        endDate: values.endDate,
        nonce: await seaport.getNonce(account),
      },
      {
        address: token.erc721Template!.erc721Collection!.address,
        tokenId: token.tokenId,
      },
      {
        address: values.token,
        minAmount: values.minAmount,
        maxAmount: values.maxAmount,
      },
    );
  };

  const handleAuctionCancel = () => {
    setIsAuctionDialogOpen(false);
  };

  const initialValues = {
    minAmount: constants.WeiPerEther.toString(),
    maxAmount: constants.WeiPerEther.toString(),
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    token: constants.AddressZero,
  };

  return (
    <>
      <Button onClick={handleAuction} data-testid="Erc721TokenAuctionButton">
        <FormattedMessage id="form.buttons.sell" />
      </Button>
      <Erc721TokenAuctionDialog
        onCancel={handleAuctionCancel}
        onConfirm={handleAuctionConfirmed}
        open={isAuctionDialogOpen}
        initialValues={initialValues}
        data={token.erc721Template}
      />
    </>
  );
};
