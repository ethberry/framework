import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

import { DispenserUploadButton } from "../../../../../components/buttons";
import { AllowanceButton } from "./allowance";

export const Dispenser: FC = () => {
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "dispenser"]} />

      <PageHeader message="pages.dispenser.title">
        <AllowanceButton />
        <DispenserUploadButton />
      </PageHeader>

      <Typography>
        <FormattedMessage id="pages.dispenser.description" />
      </Typography>
    </Fragment>
  );
};
