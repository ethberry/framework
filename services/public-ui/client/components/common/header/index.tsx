import React, {FC} from "react";
import {AppBar, Hidden, Link, Toolbar} from "@material-ui/core";
import {Link as RouterLink} from "react-router-dom";

import {companyName} from "@trejgun/solo-constants-misc";

import {Sections} from "./sections";
import {Translation} from "./translation";

import useStyles from "./styles";

export const Header: FC = () => {
  const classes = useStyles();
  return (
    <AppBar className={classes.appbar} position="fixed">
      <Toolbar className={classes.toolbar}>
        <Link className={classes.title} component={RouterLink} to="/">
          <Hidden smDown>{companyName}</Hidden>
        </Link>
        <div className={classes.grow} />
        <Translation />
        <Sections />
      </Toolbar>
    </AppBar>
  );
};
