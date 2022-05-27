import { FC, useState } from "react";
import { Button } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { constants } from "ethers";
import { ItemType } from "@bthn/seaport-js/lib/constants";
import { useWeb3React } from "@web3-react/core";
import { useSnackbar } from "notistack";

import { useWallet } from "@gemunion/provider-wallet";
import { IErc721Token } from "@framework/types";

import { Erc721TokenAuctionDialog, IErc721SellOptions } from "./auction";
import { useSeaport } from "../../../hooks/use-seaport";
import { useFees } from "../../../hooks/use-fees";

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

  const handleHandleConfirmed = async (values: IErc721SellOptions) => {
    if (!account) {
      openConnectWalletDialog();
      enqueueSnackbar(formatMessage({ id: "snackbar.walletIsNotConnected" }), { variant: "error" });
      return;
    }

    const nonce = await seaport.getNonce(account);

    const { executeAllActions } = await seaport.createOrder({
      offer: [
        {
          itemType: ItemType.ERC721,
          token: token.erc721Template!.erc721Collection!.address,
          identifier: token.tokenId,
        },
      ],
      consideration: [
        {
          token: values.token,
          amount: values.minPrice,
          endAmount: values.maxPrice,
        },
      ],
      nonce,
      startTime: values.startTime ? Math.ceil(new Date(values.startTime).getTime() / 1000).toString() : void 0,
      endTime: values.startTime ? Math.ceil(new Date(values.startTime).getTime() / 1000).toString() : void 0,
      fees: useFees(token),
    });

    await executeAllActions();
  };

  const handleAuctionCancel = () => {
    setIsAuctionDialogOpen(false);
  };

  const initialValues = {
    minPrice: constants.WeiPerEther.toString(),
    maxPrice: constants.WeiPerEther.toString(),
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    token: constants.AddressZero,
  };

  return (
    <>
      <Button onClick={handleAuction} data-testid="Erc721TokenSellButton">
        <FormattedMessage id="form.buttons.sell" />
      </Button>
      <Erc721TokenAuctionDialog
        onCancel={handleAuctionCancel}
        onConfirm={handleHandleConfirmed}
        open={isAuctionDialogOpen}
        initialValues={initialValues}
      />
    </>
  );
};
