import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";

import { Header } from "../header";
import { useStyles } from "./styles";

export const Layout: FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Header />
      <Container className={classes.container} maxWidth="md">
        <Outlet />
      </Container>
    </div>
  );
};
