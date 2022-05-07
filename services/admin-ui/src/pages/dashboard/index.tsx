import { FC } from "react";

import { PageHeader } from "@gemunion/mui-page-layout";

import { Admin } from "./sections/admin";
import { Tokens } from "./sections/tokens";
import { useStyles } from "./styles";

export const Dashboard: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PageHeader message="pages.dashboard.title" />

      <Tokens />
      <Admin />
    </div>
  );
};
