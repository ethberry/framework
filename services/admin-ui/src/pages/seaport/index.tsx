import { FC } from "react";
import { Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

import { useStyles } from "./styles";

export const Seaport: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Breadcrumbs path={["dashboard", "seaport"]} />

      <PageHeader message="pages.seaport.title" />

      <Typography>Here be dragons!</Typography>
    </div>
  );
};
