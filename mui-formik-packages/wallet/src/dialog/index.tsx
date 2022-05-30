import { FC } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { FormattedMessage } from "react-intl";

import {
  // AuthereumButton,
  // FortmaticButton,
  // LedgerButton,
  MetaMaskButton,
  // PortisButton,
  // TorusButton,
  // TrezorButton,
  WalletConnectButton,
} from "./buttons";
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
        <MetaMaskButton onClick={onClose} />
        <WalletConnectButton onClick={onClose} />
        {/* <TrezorButton onClick={onClose} /> */}
        {/* <LedgerButton onClick={onClose} /> */}
        {/* <TorusButton onClick={onClose} /> */}
        {/* <FortmaticButton onClick={onClose} /> */}
        {/* <AuthereumButton onClick={onClose} /> */}
        {/* <PortisButton onClick={onClose} /> */}
      </DialogContent>
    </Dialog>
  );
};
