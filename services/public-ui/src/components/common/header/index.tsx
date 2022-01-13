import { FC } from "react";
import { AppBar, Hidden, Link, Toolbar } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { companyName, EnabledLanguages } from "@gemunion/framework-constants";

import { Sections } from "./sections";
import { Localization } from "@gemunion/provider-localization";
import { Theme } from "@gemunion/provider-theme";

import { useStyles } from "./styles";

export const Header: FC = () => {
  const classes = useStyles();
  return (
    <AppBar position="fixed">
      <Toolbar className={classes.toolbar}>
        <Link className={classes.title} component={RouterLink} to="/">
          <Hidden smDown>{companyName}</Hidden>
        </Link>
        <div className={classes.grow} />
        <Theme />
        <Localization languages={Object.values(EnabledLanguages)} />
        <Sections />
      </Toolbar>
    </AppBar>
  );
};
