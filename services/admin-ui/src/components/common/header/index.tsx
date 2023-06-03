import { FC } from "react";
import { AppBar, Hidden } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { companyName, EnabledLanguages } from "@framework/constants";
import { Wallet } from "@gemunion/provider-wallet";
import { Localization } from "@gemunion/provider-localization";
import { Theme } from "@gemunion/provider-theme";

import { NetworkButton } from "./network";
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
        <NetworkButton />
        <Wallet />
        <Theme />
        <Localization languages={Object.values(EnabledLanguages)} />
        <Sections />
      </StyledToolbar>
    </AppBar>
  );
};
