import { FC } from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import type { IUser } from "@framework/types";
import { useUser } from "@gemunion/provider-user";
import { useAppDispatch, walletActions } from "@gemunion/redux";

import { CloseButton } from "../../buttons";

export interface IWalletDialogProps {
  open: boolean;
  onClose: () => void;
}

export const WalletMenuDialog: FC<IWalletDialogProps> = props => {
  const { onClose, open } = props;

  const user = useUser<IUser>();
  const { connector } = useWeb3React();
  const { setActiveConnector } = walletActions;
  const dispatch = useAppDispatch();

  const handleDisconnect = () => {
    if (connector?.deactivate) {
      void connector.deactivate();
    } else {
      void connector.resetState();
    }

    void user.logOut("/");
    localStorage.clear();
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
