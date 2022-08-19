import { FC, Fragment } from "react";
import { Outlet } from "react-router-dom";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const ClaimWrapper: FC = () => {
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "claim"]} />

      <PageHeader message="pages.claim.title" />

      <Outlet />
    </Fragment>
  );
};
