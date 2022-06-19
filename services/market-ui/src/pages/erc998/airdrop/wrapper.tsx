import { FC, Fragment } from "react";
import { Outlet } from "react-router-dom";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const Erc998AirdropWrapper: FC = () => {
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc998-airdrop"]} />

      <PageHeader message="pages.erc998-airdrop.title" />

      <Outlet />
    </Fragment>
  );
};
