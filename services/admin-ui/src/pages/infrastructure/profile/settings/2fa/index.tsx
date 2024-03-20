import { FC } from "react";
import { Grid } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-layout";

import { SwitchTwoFA } from "./switch-2fa";

export const TwoFA: FC = () => {
  return (
    <Grid>
      <PageHeader message="pages.profile.settings.2fa.title" />

      <SwitchTwoFA />
    </Grid>
  );
};
