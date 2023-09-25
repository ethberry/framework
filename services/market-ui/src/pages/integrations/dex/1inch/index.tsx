import { FC } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { OneInch as OneInchSwap } from "@framework/1inch";
import { StyledGrid } from "./styled";

export const OneInch: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "dex", "dex.1inch"]} />

      <PageHeader message="pages.dex.1inch.title" />

      <StyledGrid item>
        <OneInchSwap />
      </StyledGrid>
    </Grid>
  );
};
