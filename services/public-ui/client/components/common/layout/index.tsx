import React, { FC } from "react";
import { Container } from "@mui/material";

import { Header } from "../header";
import { useStyles } from "./styles";

export const Layout: FC = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Header />
      <Container className={classes.container} maxWidth="md">
        <div>{children}</div>
      </Container>
    </div>
  );
};
