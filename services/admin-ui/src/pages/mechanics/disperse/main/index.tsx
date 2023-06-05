import { FC, Fragment } from "react";
import { Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

import { DisperseUploadButton } from "../../../../components/buttons/mechanics/disperse/upload";

export const Disperse: FC = () => {
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "disperse"]} />

      <PageHeader message="pages.disperse.title">
        <DisperseUploadButton />
      </PageHeader>

      <Typography>Here be dragons</Typography>
    </Fragment>
  );
};
