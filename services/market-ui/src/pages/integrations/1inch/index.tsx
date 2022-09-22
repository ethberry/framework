import { FC } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { OneInchProvider } from "@gemunion/provider-1inch/dist/provider/provider";

import { Swap } from "./components/swap";
import { Header } from "./components/header";
import { Warning } from "./components/warning";

export const OneInch: FC = () => {
  return (
    <OneInchProvider>
      <Grid>
        <Breadcrumbs path={["dashboard", "1inch"]} />

        <PageHeader message="pages.1inch.title" />

        <Header />
        <Warning />
        <Swap />
      </Grid>
    </OneInchProvider>
  );
};
