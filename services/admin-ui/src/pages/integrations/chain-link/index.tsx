import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { Grid, MenuItem, Select, Typography } from "@mui/material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";

import { useApiCall } from "@gemunion/react-hooks";
import { useMetamaskValue } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

import GetSubscriptionABI from "../../../abis/integrations/chain-link/fund/getSubscription.abi.json";
import LinkBalanceOfABI from "../../../abis/integrations/chain-link/fund/balanceOf.abi.json";

import { ChainLinkSubscriptionBalance } from "./subscription-balance";
import { IChainLinkSubscription, IUser, UserRole } from "@framework/types";
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

  if (!profile.userRoles.includes(UserRole.ADMIN)) {
    return (
      <Grid container spacing={2}>
        <Breadcrumbs path={["dashboard", "chain-link"]} />
        <PageHeader message="pages.chain-link.title" />
      </Grid>
    );
  }

  const [merchantSubscriptions, setMerchantSubscriptions] = useState<Array<IChainLinkSubscription> | null>(null);

  const [subData, setSubData] = useState<IVrfSubscriptionData>({
    owner: "",
    balance: 0,
    reqCount: 0,
    consumers: [""],
  });
  const [currentBalance, setCurrentBalance] = useState<string>("0");
  const [currentSubscription, setCurrentSubscription] = useState<number>(0);

  const { fn, isLoading } = useApiCall(
    api => {
      return api.fetchJson({
        url: `/chain-link/subscriptions/${profile.wallet}`,
        method: "GET",
      });
    },
    { success: false },
  );

  const getSubscriptionData = useMetamaskValue(
    async (subscriptionId: number, web3Context: Web3ContextType) => {
      // TODO get VRF contract address from backend
      const contract = new Contract(process.env.VRF_ADDR, GetSubscriptionABI, web3Context.provider?.getSigner());
      if ((await contract.provider.getCode(contract.address)) !== "0x") {
        const data: IVrfSubscriptionData = await contract.getSubscription(subscriptionId);
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
    if (!merchantSubscriptions && !isLoading) {
      void fn().then((rows: Array<IChainLinkSubscription>) => {
        const filtered = rows.filter(sub => sub.merchant.wallet === profile.wallet && sub.chainId === profile.chainId);
        setMerchantSubscriptions(filtered);
        setCurrentSubscription(filtered && filtered.length > 0 ? filtered[0].vrfSubId : 0);
      });
    }
    if (!merchantSubscriptions || !account) {
      return;
    }
    void getSubscriptionData(currentSubscription).then(setSubData);
    void getAccountBalance(18, "LINK").then(setCurrentBalance);
  }, [currentSubscription]);

  return merchantSubscriptions ? (
    <Grid container spacing={2}>
      <Breadcrumbs path={["dashboard", "chain-link"]} />
      <PageHeader message="pages.chain-link.title" />
      <Typography variant="h4">
        <FormattedMessage id="pages.chain-link.select" />
      </Typography>
      <Select
        sx={{ mx: 1 }}
        value={currentSubscription}
        onChange={(e: any) => {
          setCurrentSubscription(e.target.value);
        }}
      >
        {merchantSubscriptions.map((option, idx) => (
          <MenuItem value={option.vrfSubId} key={idx}>
            {option.vrfSubId}
          </MenuItem>
        ))}
      </Select>
      <Grid item xs={6}>
        <ChainLinkSubscriptionCreateButton />
      </Grid>
      <Grid item xs={12}>
        <ChainLinkSubscriptionBalance
          subscriptionId={currentSubscription}
          walletBalance={currentBalance}
          subBalance={subData.balance}
        />
      </Grid>
      <Grid item xs={12}>
        <ChainLinkSubscriptionConsumer subscriptionId={currentSubscription} consumers={subData.consumers} />
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
