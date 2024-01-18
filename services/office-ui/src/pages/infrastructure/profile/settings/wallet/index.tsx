import { FC } from "react";
import { Grid } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { PageHeader } from "@gemunion/mui-page-layout";
import { useUser } from "@gemunion/provider-user";
import type { IUser } from "@framework/types";

import { AttachWalletButton } from "./attach-wallet";
import { StyledTypography } from "./styled";

export const Wallet: FC = () => {
  const { profile } = useUser<IUser>();

  return (
    <Grid>
      <PageHeader message="pages.profile.settings.wallet.title" />
      <StyledTypography>
        <FormattedMessage id="pages.profile.settings.wallet.connectedWallet" />: {profile.wallet || "N/A"}
      </StyledTypography>
      <AttachWalletButton />
    </Grid>
  );
};
