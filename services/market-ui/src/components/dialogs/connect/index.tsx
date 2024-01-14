import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

import { MetaMaskButton, ParticleButton, WalletConnectButton } from "@gemunion/provider-wallet";

import { CloseButton } from "../../buttons";

interface IConnectWalletProps {
  open: boolean;
  onClose: () => void;
}

export const ConnectWallet: FC<IConnectWalletProps> = props => {
  const { open, onClose } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FormattedMessage id="components.header.wallet.connect" />
        <CloseButton onClick={onClose} />
      </DialogTitle>
      <DialogContent>
        <MetaMaskButton onClick={onClose} data-testid="ConnectMetamaskButton" />
        <WalletConnectButton onClick={onClose} data-testid="ConnectWalletConnectButton" />
        <ParticleButton onClick={onClose} data-testid="ConnectParticleGoogleButton" />
      </DialogContent>
    </Dialog>
  );
};
