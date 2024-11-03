import { FC } from "react";
import { Grid } from "@mui/material";

import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";

export const Dragons: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "dragons"]} />

      <PageHeader message="pages.dragons.title" />

      <FormattedMessage id="pages.dragons.description" />
    </Grid>
  );
};
