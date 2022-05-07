import { FC } from "react";
import { Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

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
