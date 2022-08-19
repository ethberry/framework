import { FC, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Button, Grid, TextField } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useClipboard } from "use-clipboard-copy";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useWallet } from "@gemunion/provider-wallet";

import { ReferralRewardButton } from "../../../../components/buttons/mechanics/referral/reward";

export const ReferralLink: FC = () => {
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
      <Breadcrumbs path={["dashboard", "referral", "referral.link"]} />

      <PageHeader message="pages.referral.link.title">
        <ReferralRewardButton />
      </PageHeader>

      <TextField
        value={`${process.env.MARKET_FE_URL}/?referrer=${account}`}
        variant="standard"
        sx={{ width: 650 }}
        inputRef={clipboard.target}
      />
      <Button onClick={clipboard.copy}>
        <FormattedMessage id="form.buttons.copy" />
      </Button>
    </Grid>
  );
};
