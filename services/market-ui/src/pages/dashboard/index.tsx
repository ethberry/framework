import { FC } from "react";

import { PageHeader } from "@gemunion/mui-page-header";

import { Tokens } from "./sections/tokens";
import { Sections } from "./sections/sections";
import { useStyles } from "./styles";

export const Dashboard: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PageHeader message="pages.dashboard.title" />

      <Tokens />
      <Sections />
    </div>
  );
};
