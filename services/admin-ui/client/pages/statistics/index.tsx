import React, {FC} from "react";

import {Grid} from "@material-ui/core";
import {PageHeader} from "@trejgun/material-ui-page-header";

import {Breadcrumbs} from "../../components/common/breadcrumbs";

export const Statistics: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "statistics"]} />

      <PageHeader message="pages.statistics.title" />
    </Grid>
  );
};
