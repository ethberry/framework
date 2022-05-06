import { FC } from "react";
import { Paper } from "@mui/material";
import { PageHeader } from "@gemunion/mui-page-header";

import { useStyles } from "./styles";

export const Blockchain: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PageHeader message="pages.blockchain.title" />

      <Paper sx={{ p: 2 }}>Here be dragons</Paper>
    </div>
  );
};
