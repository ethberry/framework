import { FC, Fragment, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Contract } from "ethers";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { Grid, MenuItem, Typography } from "@mui/material";

import { useApiCall } from "@gemunion/react-hooks";
import { useMetamaskValue, useSystemContract } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { formatEther } from "@framework/exchange";
import type { IChainLinkSubscription, IContract, IUser } from "@framework/types";
import { SystemModuleType, UserRole } from "@framework/types";

import { ChainLinkSubscriptionCreateButton } from "../../../components/buttons/integrations/chain-link/create-subscription";
import { ChainLinkFundButton } from "../../../components/buttons/integrations/chain-link/fund";
import { ChainLinkAddConsumerButton } from "../../../components/buttons/integrations/chain-link/add-subscription";
import { StyledDataGridPremium, StyledGrid, StyledSelect, wrapperSxMixin } from "./styled";
import getSubscriptionVRFCoordinatorV2MockABI from "@framework/abis/getSubscription/VRFCoordinatorV2Mock.json";
import balanceOfBasicTokenABI from "@framework/abis/balanceOf/BasicToken.json";

export interface IVrfSubscriptionData {
  owner: string;
  balance: any; // bigint
  reqCount: any; // bigint
  consumers: Array<string>;
}

export const ChainLink: FC = () => {
  const { account } = useWeb3React();
  const { profile } = useUser<IUser>();
  const { formatMessage } = useIntl();

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
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const { fn, isLoading } = useApiCall(
    api => {
      return api.fetchJson({
        url: `/chain-link/subscriptions/${profile.wallet}`,
        method: "GET",
      });
    },
    { success: false },
  );

  const getAccountBalance = useSystemContract<IContract, SystemModuleType>(
    async (values: any, web3Context: Web3ContextType, systemContract: IContract) => {
      // https://docs.chain.link/docs/link-token-contracts/
      const contract = new Contract(
        systemContract.parameters.linkAddress.toString(),
        balanceOfBasicTokenABI,
        web3Context.provider?.getSigner(),
      );
      if ((await contract.provider.getCode(contract.address)) !== "0x") {
        const value = await contract.callStatic.balanceOf(web3Context.account);
        return formatEther(value.toString(), values.decimals, values.symbol);
      }
      return Number.NaN.toString();
    },
    { success: false },
  );

  const getSubscriptionData = useSystemContract<IContract, SystemModuleType>(
    async (subscriptionId: number, web3Context: Web3ContextType, systemContract: IContract) => {
      const contract = new Contract(
        systemContract.address,
        getSubscriptionVRFCoordinatorV2MockABI,
        web3Context.provider?.getSigner(),
      );
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

  const metaFnBalanceData = useMetamaskValue(
    (values: any, web3Context: Web3ContextType) => {
      return getAccountBalance(SystemModuleType.CHAIN_LINK, values, web3Context);
    },
    { success: false },
  );

  const metaFnSubData = useMetamaskValue(
    (values: any, web3Context: Web3ContextType) => {
      return getSubscriptionData(SystemModuleType.CHAIN_LINK, values, web3Context);
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
    void metaFnSubData(currentSubscription).then(setSubData);
    void metaFnBalanceData({ decimals: 18, symbol: "LINK" }).then(setCurrentBalance);
  }, [currentSubscription]);

  const columns = [
    {
      field: "contract",
      headerName: formatMessage({ id: "form.labels.contract" }),
      flex: 1,
      minWidth: 300,
    },
  ];

  if (merchantSubscriptions === null) {
    return <ProgressOverlay isLoading={true} />;
  }

  const subscriptionTitle = currentSubscription ? "pages.chain-link.id" : "pages.chain-link.noSubscription";

  return (
    <ProgressOverlay isLoading={isLoading} wrapperSx={wrapperSxMixin}>
      <Breadcrumbs path={["dashboard", "chain-link"]} />
      {merchantSubscriptions.length ? (
        <Fragment>
          <PageHeader message="pages.chain-link.title">
            <StyledSelect
              sx={{ mx: 1 }}
              value={currentSubscription}
              size="small"
              onChange={(e: any) => {
                setCurrentSubscription(e.target.value);
              }}
            >
              {merchantSubscriptions.map((option, idx) => (
                <MenuItem value={option.vrfSubId} key={idx}>
                  {option.vrfSubId}
                </MenuItem>
              ))}
            </StyledSelect>
            <ChainLinkSubscriptionCreateButton />
          </PageHeader>
          <StyledGrid container spacing={2}>
            <Grid item xs={8}>
              <Typography gutterBottom variant="h5" component="p">
                <FormattedMessage
                  id={subscriptionTitle}
                  values={{
                    value: currentSubscription,
                  }}
                />
              </Typography>
              <Typography gutterBottom variant="body1" component="p">
                <FormattedMessage
                  id="pages.chain-link.balance"
                  values={{
                    balance: formatEther(subData.balance.toString(), 18, "LINK"),
                  }}
                />
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <ChainLinkFundButton subscriptionId={currentSubscription} />
              <Typography variant="body1" sx={{ mx: 1 }}>
                <FormattedMessage id="pages.chain-link.wallet" values={{ value: currentBalance }} />
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography gutterBottom variant="h5" component="p">
                <FormattedMessage id="pages.chain-link.consumers" />
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <ChainLinkAddConsumerButton subscriptionId={currentSubscription} />
            </Grid>
            <Grid item xs={12}>
              <StyledDataGridPremium
                pagination
                rowCount={subData.consumers.length}
                pageSizeOptions={[5, 10, 25]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                loading={isLoading}
                columns={columns}
                rowThreshold={0}
                rowHeight={40}
                rows={subData.consumers.map(contract => ({
                  contract,
                }))}
                getRowId={({ contract }: any) => contract as string}
              />
            </Grid>
          </StyledGrid>
        </Fragment>
      ) : (
        <Fragment>
          <PageHeader message="pages.chain-link.title" />
          <StyledGrid container spacing={2}>
            <Grid item xs={12}>
              <ChainLinkSubscriptionCreateButton />
            </Grid>
          </StyledGrid>
        </Fragment>
      )}
    </ProgressOverlay>
  );
};
