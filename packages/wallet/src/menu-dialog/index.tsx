import { FC } from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, walletActions } from "@gemunion/redux";

import { CloseButton } from "../dialog/close-button";

export interface IWalletDialogProps {
  open: boolean;
  onClose: () => void;
}

export const WalletMenuDialog: FC<IWalletDialogProps> = props => {
  const { onClose, open } = props;

  const { connector } = useWeb3React();

  const { setActiveConnector } = walletActions;
  const dispatch = useAppDispatch();

  const handleDisconnect = () => {
    if (connector?.deactivate) {
      void connector.deactivate();
    } else {
      void connector.resetState();
    }

    dispatch(setActiveConnector(null));
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FormattedMessage id="components.header.wallet.menu" />
        <CloseButton onClick={onClose} />
      </DialogTitle>
      <DialogContent>
        <Button onClick={handleDisconnect}>
          <FormattedMessage id="form.buttons.disconnect" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};
