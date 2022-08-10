import { FC, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Grid, Paper } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useWallet } from "@gemunion/provider-wallet";

export const ReferralLink: FC = () => {
  const { isActive, account } = useWeb3React();
  const { openConnectWalletDialog } = useWallet();

  useEffect(() => {
    if (!isActive) {
      void openConnectWalletDialog();
    }
  }, [isActive]);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "referral", "referral.link"]} />

      <PageHeader message="pages.referral.link.title" />

      <Paper sx={{ p: 1 }}>
        {process.env.MARKET_FE_URL}/?referrer={account}
      </Paper>
    </Grid>
  );
};
