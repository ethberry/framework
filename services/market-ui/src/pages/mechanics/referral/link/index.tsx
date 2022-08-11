import { FC, useEffect } from "react";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { Button, Grid, TextField } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useClipboard } from "use-clipboard-copy";
import { Contract } from "ethers";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useWallet } from "@gemunion/provider-wallet";
import { useMetamask } from "@gemunion/react-hooks-eth";
import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

export const ReferralLink: FC = () => {
  const { isActive, account = "" } = useWeb3React();
  const { openConnectWalletDialog, closeConnectWalletDialog } = useWallet();
  const clipboard = useClipboard();

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, web3Context.provider?.getSigner());
    return contract.withdraw() as Promise<void>;
  });

  const handleWithdraw = () => {
    return metaFn();
  };

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

      <PageHeader message="pages.referral.link.title" />

      <TextField
        value={`${process.env.MARKET_FE_URL}/?referrer=${account}`}
        variant="standard"
        sx={{ width: 650 }}
        inputRef={clipboard.target}
      />
      <Button onClick={clipboard.copy}>
        <FormattedMessage id="form.buttons.copy" />
      </Button>

      <br />

      <Button onClick={handleWithdraw}>
        <FormattedMessage id="form.buttons.withdraw" />
      </Button>
    </Grid>
  );
};
