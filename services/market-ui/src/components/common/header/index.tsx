import { FC } from "react";
import { AppBar, Hidden } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { companyName, EnabledLanguages } from "@framework/constants";
import { Localization } from "@gemunion/provider-localization";
import { Theme } from "@gemunion/provider-theme";
import { WalletButton, NetworkButton } from "@gemunion/provider-wallet";
import { MetamaskLoginButton, MetamaskRelogin } from "@gemunion/login-button-metamask";
import { ParticleLoginButton } from "@gemunion/login-button-particle";
import { WalletConnectLoginButton } from "@gemunion/login-button-wallet-connect";
import { FirebaseLogin } from "@gemunion/firebase-login";

import { DashboardButton } from "./dashboard";
import { Referrer } from "./referrer";
import { Sections } from "./sections";
import { StyledGrow, StyledLink, StyledToolbar } from "./styled";

export const Header: FC = () => {
  return (
    <AppBar position="fixed">
      <StyledToolbar>
        <StyledLink component={RouterLink} to="/">
          <Hidden smDown>{companyName} - Marketplace</Hidden>
        </StyledLink>
        <StyledGrow />
        <Referrer />
        <Theme />
        <Localization languages={Object.values(EnabledLanguages)} />
        <NetworkButton />
        <MetamaskRelogin />
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
