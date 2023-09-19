import { FC, Fragment, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamaskValue } from "@gemunion/react-hooks-eth";

import GetSubscriptionABI from "../../../../abis/integrations/chain-link/fund/getSubscription.abi.json";
import LinkBalanceOfABI from "../../../../abis/integrations/chain-link/fund/balanceOf.abi.json";
import { formatEther } from "../../../../utils/money";

export const ChainLinkSubscriptionBalance: FC = () => {
  const { account } = useWeb3React();

  const [subBalance, setSubBalance] = useState<string | null>(null);
  const [currentBalance, setCurrentBalance] = useState<string | null>(null);

  const getSubscriptionBalance = useMetamaskValue(
    async (subscriptionId: number, web3Context: Web3ContextType) => {
      const contract = new Contract(process.env.VRF_ADDR, GetSubscriptionABI, web3Context.provider?.getSigner());
      if ((await contract.provider.getCode(contract.address)) !== "0x") {
        const { balance } = await contract.getSubscription(subscriptionId);
        return formatEther(balance.toString(), 18, "LINK");
      }
      return Number.NaN.toString();
    },
    { success: false },
  );

  const getAccountBalance = useMetamaskValue(
    async (decimals: number, symbol: string, web3Context: Web3ContextType) => {
      // https://docs.chain.link/docs/link-token-contracts/
      const contract = new Contract(process.env.LINK_ADDR, LinkBalanceOfABI, web3Context.provider?.getSigner());
      if ((await contract.provider.getCode(contract.address)) !== "0x") {
        const value = await contract.callStatic.balanceOf(web3Context.account);
        return formatEther(value.toString(), decimals, symbol);
      }
      return Number.NaN.toString();
    },
    { success: false },
  );

  useEffect(() => {
    if (currentBalance || !account) {
      return;
    }

    void getAccountBalance(18, "LINK").then(setCurrentBalance);
    void getSubscriptionBalance(~~process.env.CHAINLINK_SUBSCRIPTION_ID).then(setSubBalance);
  }, [account, currentBalance]);

  return (
    <Fragment>
      <Typography variant="body1">
        <FormattedMessage id="dialogs.currentBalance" values={{ value: currentBalance }} />
      </Typography>
      <Typography variant="body1">
        <FormattedMessage id="dialogs.subBalance" values={{ value: subBalance }} />
      </Typography>
    </Fragment>
  );
};
