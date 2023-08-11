import { FC } from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import { useWallet } from "@gemunion/provider-wallet";

import { CloseButton } from "../../buttons";

export interface IWalletDialogProps {
  open: boolean;
  onClose: () => void;
}

export const WalletMenuDialog: FC<IWalletDialogProps> = props => {
  const { onClose, open } = props;

  const { connector } = useWeb3React();
  const { setActiveConnector } = useWallet();

  const handleDisconnect = () => {
    if (connector?.deactivate) {
      void connector.deactivate();
    } else {
      void connector.resetState();
    }

    setActiveConnector(null);
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
