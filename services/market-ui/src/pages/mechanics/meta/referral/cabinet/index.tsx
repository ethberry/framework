import { FC, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Button, Grid } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useClipboard } from "use-clipboard-copy";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useWallet } from "@gemunion/provider-wallet";

import { ReferralRewardButton } from "../../../../../components/buttons";
import { StyledTextField } from "./styled";

export const ReferralCabinet: FC = () => {
  const { isActive, account = "" } = useWeb3React();
  const { openConnectWalletDialog, closeConnectWalletDialog } = useWallet();
  const clipboard = useClipboard();

  useEffect(() => {
    if (!isActive) {
      void openConnectWalletDialog();
    } else {
      void closeConnectWalletDialog();
    }
  }, [isActive]);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "referral", "referral.cabinet"]} />

      <PageHeader message="pages.referral.cabinet.title">
        <ReferralRewardButton />
      </PageHeader>

      <StyledTextField
        value={`${process.env.MARKET_FE_URL}/?referrer=${account}`}
        variant="standard"
        inputRef={clipboard.target}
      />
      <Button onClick={clipboard.copy}>
        <FormattedMessage id="form.buttons.copy" />
      </Button>
    </Grid>
  );
};