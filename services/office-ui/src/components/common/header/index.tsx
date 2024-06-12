import { FC } from "react";
import { AppBar, Hidden } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { companyName, EnabledLanguages } from "@framework/constants";
import { Localization } from "@gemunion/provider-localization";
import { Theme } from "@gemunion/provider-theme";

import { WalletButton } from "../../buttons";
import { DashboardButton } from "./dashboard";
import { NetworkButton } from "./network";
import { Sections } from "./sections";
import { StyledGrow, StyledLink, StyledToolbar } from "./styled";

export const Header: FC = () => {
  return (
    <AppBar position="fixed">
      <StyledToolbar>
        <StyledLink component={RouterLink} to="/">
          <Hidden smDown>{companyName} - Back-Office panel</Hidden>
        </StyledLink>
        <StyledGrow />
        <Theme />
        <Localization languages={Object.values(EnabledLanguages)} />
        <NetworkButton />
        <WalletButton />
        <DashboardButton />
        <Sections />
      </StyledToolbar>
    </AppBar>
  );
};
