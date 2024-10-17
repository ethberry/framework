import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";

import { DispenserUploadButton } from "../../../../../components/buttons";
import { AllowanceButtonForDispenser } from "./allowance";

export const Dispenser: FC = () => {
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "dispenser"]} />

      <PageHeader message="pages.dispenser.title">
        <AllowanceButtonForDispenser />
        <DispenserUploadButton />
      </PageHeader>

      <Typography>
        <FormattedMessage id="pages.dispenser.description" />
      </Typography>
    </Fragment>
  );
};
