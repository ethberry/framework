import { FC } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

import { RatePlansSelection } from "../../../components/common/rate-plan";

export const RatePlan: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "ratePlan"]} />

      <PageHeader message="pages.ratePlan.title" />

      <RatePlansSelection />
    </Grid>
  );
};
