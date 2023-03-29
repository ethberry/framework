import { FC } from "react";
import { AppBar, Hidden, Link, Toolbar } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { companyName, EnabledLanguages } from "@framework/constants";
import { Localization } from "@gemunion/provider-localization";
import { Theme } from "@gemunion/provider-theme";

import { NetworkButton } from "../../buttons/network";
import { WalletButton } from "../../buttons/wallet";
import { Referrer } from "./referrer";
import { Cart } from "./cart";
import { Sections } from "./sections";
import { useStyles } from "./styles";

export const Header: FC = () => {
  const classes = useStyles();
  return (
    <AppBar position="fixed">
      <Toolbar className={classes.toolbar}>
        <Link className={classes.title} component={RouterLink} to="/">
          <Hidden smDown>{companyName} - Marketplace</Hidden>
        </Link>
        <div className={classes.grow} />
        <Referrer />
        <NetworkButton />
        <WalletButton />
        <Cart />
        <Theme />
        <Localization languages={Object.values(EnabledLanguages)} />
        <Sections />
      </Toolbar>
    </AppBar>
  );
};
