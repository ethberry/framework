import { FC } from "react";
import { AppBar, Hidden } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { companyName, EnabledLanguages } from "@framework/constants";
import { Localization } from "@ethberry/provider-localization";
import { Theme } from "@ethberry/provider-theme";
import { NetworkButton, WalletButton } from "@ethberry/provider-wallet";
import { MetamaskLoginButton } from "@ethberry/login-button-metamask";
import { ParticleLoginButton } from "@ethberry/login-button-particle";
import { WalletConnectLoginButton } from "@ethberry/login-button-wallet-connect";
import { FirebaseLogin } from "@ethberry/firebase-login";

import { DashboardButton } from "./dashboard";
import { Sections } from "./sections";
import { StyledGrow, StyledLink, StyledToolbar } from "./styled";

export const Header: FC = () => {
  return (
    <AppBar position="fixed">
      <StyledToolbar>
        <StyledLink component={RouterLink} to="/">
          <Hidden smDown>{companyName} - Admin panel</Hidden>
        </StyledLink>
        <StyledGrow />
        <Theme />
        <Localization languages={Object.values(EnabledLanguages)} />
        <NetworkButton />
        <WalletButton>
          <FirebaseLogin
            withEmail={false}
            buttons={[MetamaskLoginButton, WalletConnectLoginButton, ParticleLoginButton]}
          />
        </WalletButton>
        <DashboardButton />
        <Sections />
      </StyledToolbar>
    </AppBar>
  );
};
