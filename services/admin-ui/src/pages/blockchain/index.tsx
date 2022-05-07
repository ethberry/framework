import { FC } from "react";
import { Typography } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-header";
import { Breadcrumbs } from "@gemunion/mui-breadcrumbs";

import { useStyles } from "./styles";

export const Blockchain: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Breadcrumbs path={["dashboard", "blockchain"]} />

      <PageHeader message="pages.blockchain.title" />

      <Typography>Here be dragons!</Typography>
    </div>
  );
};
