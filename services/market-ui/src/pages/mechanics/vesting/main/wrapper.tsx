import { FC, Fragment } from "react";
import { Outlet } from "react-router-dom";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const VestingWrapper: FC = () => {
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "vesting"]} />

      <PageHeader message="pages.vesting.title" />

      <Outlet />
    </Fragment>
  );
};
