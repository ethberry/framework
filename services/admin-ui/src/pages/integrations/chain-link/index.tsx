import { FC } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

import { ChainLinkFundButton } from "../../../components/buttons/integrations/chain-link/fund";
import { ChainLinkSubscriptionButton } from "../../../components/buttons/integrations/chain-link/add-subscription";
import { ChainLinkSubscriptionBalance } from "./subscription-balance";

export const ChainLink: FC = () => {
  return (
    <Grid container spacing={2}>
      <Breadcrumbs path={["dashboard", "chain-link"]} />

      <PageHeader message="pages.chain-link.title" />
      <Grid item xs={12} sm={6}>
        <ChainLinkSubscriptionBalance />
        <ChainLinkFundButton />
      </Grid>
      <Grid item xs={12} sm={6}>
        <ChainLinkSubscriptionButton />
      </Grid>
    </Grid>
  );
};
