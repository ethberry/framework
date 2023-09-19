import { FC } from "react";
import { Grid, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useUser } from "@gemunion/provider-user";
import type { IUser } from "@framework/types";

import { AttachWalletButton } from "./attach-wallet";
import { AllowanceButton } from "./allowance";

export const MyWallet: FC = () => {
  const { profile } = useUser<IUser>();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "profile"]} />
      <PageHeader message="pages.wallet.title" />
      <Typography sx={{ mb: 2 }}>
        <FormattedMessage id="pages.wallet.connectedWallet" />: {profile.wallet || "N/A"}
      </Typography>
      <AttachWalletButton /> <AllowanceButton />
    </Grid>
  );
};
