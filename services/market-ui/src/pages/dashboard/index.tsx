import { FC } from "react";
import { Grid } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-layout";

import { useStyles } from "./styles";
import { Erc721Section } from "./sections/erc721";
import { Erc998Section } from "./sections/erc998";
import { Erc1155Section } from "./sections/erc1155";
import { Personal } from "./sections/personal";
import { Sections } from "./sections/sections";
import { Mechanics } from "./sections/mechanics";
import { Pages } from "./sections/pages";

export const Dashboard: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PageHeader message="pages.dashboard.title" />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Erc721Section />
          <Erc998Section />
          <Erc1155Section />
        </Grid>
        <Grid item xs={6}>
          <Personal />
          <Sections />
          <Mechanics />
          <Pages />
        </Grid>
      </Grid>
    </div>
  );
};
