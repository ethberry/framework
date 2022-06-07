import { FC, useState } from "react";
import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { constants } from "ethers";
import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar } from "notistack";

import { useWallet } from "@gemunion/provider-wallet";
import { IErc1155Token } from "@framework/types";

import { useSeaport } from "../../../providers/seaport";
import { Erc1155TokenAuctionDialog, IErc1155AuctionOptions } from "./auction";

interface IErc1155TokenSellButtonProps {
  token: IErc1155Token;
}

export const Erc1155TokenSellButton: FC<IErc1155TokenSellButtonProps> = props => {
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

  const handleAuctionConfirmed = async (values: IErc1155AuctionOptions) => {
    if (!account) {
      openConnectWalletDialog();
      enqueueSnackbar(formatMessage({ id: "snackbar.walletIsNotConnected" }), { variant: "error" });
      return;
    }

    await seaport.sellErc1155ForErc20(
      {
        startDate: values.startDate,
        endDate: values.endDate,
        nonce: await seaport.getNonce(account),
      },
      {
        address: token.erc1155Collection!.address,
        tokenId: token.tokenId,
        amount: values.amount,
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
    amount: "1",
    minAmount: constants.WeiPerEther.toString(),
    maxAmount: constants.WeiPerEther.toString(),
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    token: constants.AddressZero,
  };

  return (
    <>
      <Button onClick={handleAuction} data-testid="Erc1155TokenAuctionButton">
        <FormattedMessage id="form.buttons.sell" />
      </Button>
      <Erc1155TokenAuctionDialog
        onCancel={handleAuctionCancel}
        onConfirm={handleAuctionConfirmed}
        open={isAuctionDialogOpen}
        initialValues={initialValues}
        data={token}
      />
    </>
  );
};
