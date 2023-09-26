import { FC, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";

import { useMetamaskValue } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

import GetSubscriptionABI from "../../../abis/integrations/chain-link/fund/getSubscription.abi.json";
import LinkBalanceOfABI from "../../../abis/integrations/chain-link/fund/balanceOf.abi.json";

// import { ChainLinkFundButton } from "../../../components/buttons/integrations/chain-link/fund";
import { ChainLinkSubscriptionBalance } from "./subscription-balance";
import { IUser, UserRole } from "@framework/types";
import { Contract } from "ethers";
import { formatEther } from "../../../utils/money";
import { ChainLinkSubscriptionConsumer } from "./subscription-consumer";
import { ChainLinkSubscriptionCreateButton } from "../../../components/buttons/integrations/chain-link/create-subscription";

export interface IVrfSubscriptionData {
  owner: string;
  balance: any; // bigint
  reqCount: any; // bigint
  consumers: Array<string>;
}

export const ChainLink: FC = () => {
  const { account } = useWeb3React();
  const { profile } = useUser<IUser>();

  const [subData, setSubData] = useState<IVrfSubscriptionData>({
    owner: "",
    balance: 0,
    reqCount: 0,
    consumers: [""],
  });

  const [currentBalance, setCurrentBalance] = useState<string | null>(null);

  if (!profile.userRoles.includes(UserRole.ADMIN)) {
    return null;
  }

  if (!profile.merchant) {
    return null;
  }

  // TODO get chainId from MM?
  const merchantSub = profile.merchant.chainLinkSubscriptions?.filter(sub => sub.chainId === profile.chainId)[0];

  const getSubscriptionData = useMetamaskValue(
    async (subscriptionId: number, web3Context: Web3ContextType) => {
      // TODO get VRF contract address from backend
      const contract = new Contract(process.env.VRF_ADDR, GetSubscriptionABI, web3Context.provider?.getSigner());
      if ((await contract.provider.getCode(contract.address)) !== "0x") {
        const data: IVrfSubscriptionData = await contract.getSubscription(subscriptionId);
        // console.log("data", data);
        // const { owner, balance, reqCount, consumers } = data;
        // return formatEther(balance.toString(), 18, "LINK");
        return data;
      }
      return {
        owner: "",
        balance: 0,
        reqCount: 0,
        consumers: [""],
      };
    },
    { success: false },
  );

  const getAccountBalance = useMetamaskValue(
    async (decimals: number, symbol: string, web3Context: Web3ContextType) => {
      // https://docs.chain.link/docs/link-token-contracts/
      // TODO get LINK contract address from backend
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
    if (merchantSub) {
      void getAccountBalance(18, "LINK").then(setCurrentBalance);
      void getSubscriptionData(merchantSub.vrfSubId).then(setSubData);
    }
  }, [account, currentBalance]);

  return merchantSub ? (
    <Grid container spacing={2}>
      <Breadcrumbs path={["dashboard", "chain-link"]} />
      <PageHeader message="pages.chain-link.title" />
      <Grid item xs={12}>
        <ChainLinkSubscriptionBalance
          subId={merchantSub.vrfSubId}
          walletBalance={currentBalance}
          subBalance={subData.balance}
        />
      </Grid>
      <Grid item xs={12}>
        <ChainLinkSubscriptionConsumer consumers={subData.consumers} />
      </Grid>
    </Grid>
  ) : (
    <Grid container spacing={2}>
      <Breadcrumbs path={["dashboard", "chain-link"]} />
      <PageHeader message="pages.chain-link.title" />
      <Grid item xs={12}>
        <ChainLinkSubscriptionCreateButton />
      </Grid>
    </Grid>
  );
};
