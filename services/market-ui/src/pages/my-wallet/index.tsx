import { FC } from "react";
import { Grid } from "@mui/material";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { AttachWalletButton } from "./attach-wallet";
import { Erc20AllowanceButton } from "./erc20-allowance";

export const MyWallet: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["profile"]} />

      <PageHeader message="pages.my-wallet.title" />

      <AttachWalletButton />
      <Erc20AllowanceButton />
    </Grid>
  );
};
