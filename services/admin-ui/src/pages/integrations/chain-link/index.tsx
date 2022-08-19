import { FC } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

import { ChainLinkFundButton } from "../../../components/buttons/integrations/chain-link/fund";

export const ChainLink: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "chain-link"]} />

      <PageHeader message="pages.chain-link.title" />

      <ChainLinkFundButton />
    </Grid>
  );
};
