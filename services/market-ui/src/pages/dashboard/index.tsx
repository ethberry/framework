import { FC } from "react";
import { Grid } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-layout";

import { useStyles } from "./styles";
import { Erc20Sections } from "./sections/erc20";
import { Erc1155Section } from "./sections/erc1155";
import { Erc721Section } from "./sections/erc721";
import { Personal } from "./sections/personal";
import { Sections } from "./sections/sections";

export const Dashboard: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PageHeader message="pages.dashboard.title" />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Erc20Sections />
          <Erc721Section />
          <Erc1155Section />
        </Grid>
        <Grid item xs={6}>
          <Personal />
          <Sections />
        </Grid>
      </Grid>
    </div>
  );
};
