import { FC } from "react";
import { Grid } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useUser } from "@gemunion/provider-user";
import type { IUser } from "@framework/types";

import { AttachWalletButton } from "./attach-wallet";
import { StyledTypography } from "./styled";

export const Wallet: FC = () => {
  const { profile } = useUser<IUser>();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "profile"]} />
      <PageHeader message="pages.profile.setting.wallet.title" />
      <StyledTypography>
        <FormattedMessage id="pages.profile.setting.wallet.connectedWallet" />: {profile.wallet || "N/A"}
      </StyledTypography>
      <AttachWalletButton />
    </Grid>
  );
};
