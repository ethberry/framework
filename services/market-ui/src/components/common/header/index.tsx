import { FC } from "react";
import { AppBar, Hidden, Link, Toolbar } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { companyName, EnabledLanguages } from "@framework/constants";
import { Wallet } from "@gemunion/provider-wallet";
import { Localization } from "@gemunion/provider-localization";
import { Theme } from "@gemunion/provider-theme";

import { useStyles } from "./styles";
import { Sections } from "./sections";
import { Referrer } from "./referrer";

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
        <Wallet />
        <Theme />
        <Localization languages={Object.values(EnabledLanguages)} />
        <Sections />
      </Toolbar>
    </AppBar>
  );
};
