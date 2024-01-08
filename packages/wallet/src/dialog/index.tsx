import { FC } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { MetaMaskButton, WalletConnectButton } from "./buttons";
import { CloseButton } from "./close-button";

export interface IWalletConnectDialogProps {
  open: boolean;
  onClose: () => void;
}

export const WalletDialog: FC<IWalletConnectDialogProps> = props => {
  const { onClose, open } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FormattedMessage id="components.header.wallet.connect" />
        <CloseButton onClick={onClose} />
      </DialogTitle>
      <DialogContent>
        <MetaMaskButton onClick={onClose} data-testid="ConnectMetamaskButton" />
        <WalletConnectButton onClick={onClose} data-testid="ConnectWalletConnectButton" />
      </DialogContent>
    </Dialog>
  );
};
