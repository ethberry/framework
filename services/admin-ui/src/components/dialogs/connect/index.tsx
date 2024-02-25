import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

import { FirebaseLogin } from "@gemunion/firebase-login";
import { ParticleLoginButton } from "@gemunion/login-button-particle";
import { MetamaskLoginButton } from "@gemunion/login-button-metamask";

import { CloseButton } from "../../buttons";
import { StyledLoginWrapper } from "./styled";

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
        <StyledLoginWrapper>
          <FirebaseLogin withEmail={false} wallets={[MetamaskLoginButton, ParticleLoginButton]} />
        </StyledLoginWrapper>
      </DialogContent>
    </Dialog>
  );
};
