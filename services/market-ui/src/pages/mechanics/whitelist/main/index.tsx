import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";
import { FormattedMessage } from "react-intl";

import { useApiCall } from "@gemunion/react-hooks";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const Whitelist: FC = () => {
  const { account } = useWeb3React();

  const { fn } = useApiCall(async api => {
    return api.fetchJson({
      url: `/whitelist/add`,
      method: "POST",
      data: {
        account,
      },
    });
  });

  const handleAddToWhitelist = () => {
    return fn();
  };

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "whitelist"]} />

      <PageHeader message="pages.whitelist.title" />

      <Button variant="outlined" startIcon={<Add />} onClick={handleAddToWhitelist} data-testid="WhitelistAddButton">
        <FormattedMessage id="form.buttons.add" />
      </Button>
    </Fragment>
  );
};
