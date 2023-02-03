import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useUser } from "@gemunion/provider-user";
import { IUser } from "@framework/types";

import { AttachWalletButton } from "./attach-wallet";
import { AllowanceButton } from "./allowance";

export const MyWallet: FC = () => {
  const user = useUser<IUser>();

  return (
    <Grid>
      <Breadcrumbs path={["profile"]} />

      <PageHeader message="pages.my-wallet.title" />

      <Typography sx={{ mb: 2 }}>Connected wallet: {user.profile.wallet || "N/A"}</Typography>

      <AttachWalletButton />
      <AllowanceButton />
    </Grid>
  );
};
