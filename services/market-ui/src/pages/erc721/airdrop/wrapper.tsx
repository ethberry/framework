import { FC, Fragment } from "react";
import { Outlet } from "react-router-dom";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const Erc721AirdropWrapper: FC = () => {
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc721-airdrop"]} />

      <PageHeader message="pages.erc721-airdrop.title" />

      <Outlet />
    </Fragment>
  );
};
