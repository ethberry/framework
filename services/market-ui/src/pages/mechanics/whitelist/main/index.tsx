import { FC, Fragment } from "react";
import { Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const Whitelist: FC = () => {
  const { account } = useWeb3React();

  void account;

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "whitelist"]} />

      <PageHeader message="pages.whitelist.title" />

      <Typography>Here be dragons</Typography>
    </Fragment>
  );
};
