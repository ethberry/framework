import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";

import { DispenserUploadButton } from "../../../../../components/buttons";
import { AllowanceButtonForDispenser } from "./allowance";

export const Dispenser: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "dispenser"]} />

      <PageHeader message="pages.dispenser.title">
        <AllowanceButtonForDispenser />
        <DispenserUploadButton />
      </PageHeader>

      <Typography>
        <FormattedMessage id="pages.dispenser.description" />
      </Typography>
    </Grid>
  );
};
