import { FC, Fragment } from "react";
import { Outlet } from "react-router-dom";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const Erc20VestingWrapper: FC = () => {
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc20-vesting"]} />

      <PageHeader message="pages.erc20-vesting.title" />

      <Outlet />
    </Fragment>
  );
};
