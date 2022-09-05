import { FC } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

import { AttachWalletButton } from "./attach-wallet";
import { AllowanceButton } from "./allowance";
import { AllowanceCustomButton } from "./custom-allowance";

export const MyWallet: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["profile"]} />

      <PageHeader message="pages.my-wallet.title" />

      <AttachWalletButton />
      <AllowanceButton />
      <AllowanceCustomButton />
    </Grid>
  );
};
