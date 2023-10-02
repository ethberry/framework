import { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";
import { useWeb3React, Web3ContextType } from "@web3-react/core";

import { useApiCall } from "@gemunion/react-hooks";
import { useMetamaskValue, useSystemContract } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import {
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { IChainLinkSubscription, IContract, IUser, SystemModuleType, UserRole } from "@framework/types";

import GetSubscriptionABI from "../../../abis/integrations/chain-link/fund/getSubscription.abi.json";
import LinkBalanceOfABI from "../../../abis/integrations/chain-link/fund/balanceOf.abi.json";
import { ChainLinkSubscriptionCreateButton } from "../../../components/buttons/integrations/chain-link/create-subscription";
import { ChainLinkFundButton } from "../../../components/buttons/integrations/chain-link/fund";
import { ChainLinkAddConsumerButton } from "../../../components/buttons/integrations/chain-link/add-subscription";
import { CustomTablePagination } from "./styled";
import { formatEther } from "../../../utils/money";

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

  const getAccountBalance = useSystemContract<IContract, SystemModuleType>(
    async (values: any, web3Context: Web3ContextType, systemContract: IContract) => {
      // https://docs.chain.link/docs/link-token-contracts/
      const contract = new Contract(
        systemContract.parameters.linkAddress.toString(),
        LinkBalanceOfABI,
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
      const contract = new Contract(systemContract.address, GetSubscriptionABI, web3Context.provider?.getSigner());
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

  const metaFnBalanceData = useMetamaskValue((values: any, web3Context: Web3ContextType) => {
    return getAccountBalance(SystemModuleType.CHAIN_LINK, values, web3Context);
  });

  const metaFnSubData = useMetamaskValue((values: any, web3Context: Web3ContextType) => {
    return getSubscriptionData(SystemModuleType.CHAIN_LINK, values, web3Context);
  });

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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - subData.consumers.length) : 0;
  const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return merchantSubscriptions ? (
    <Grid container spacing={2}>
      <Breadcrumbs path={["dashboard", "chain-link"]} />
      <PageHeader message="pages.chain-link.title">
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
        <ChainLinkSubscriptionCreateButton />
      </PageHeader>
      <Grid item xs={8}>
        <Typography gutterBottom variant="h5" component="p">
          <FormattedMessage
            id="pages.chain-link.id"
            values={{
              value: currentSubscription || "No subscription",
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
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Contract</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? subData.consumers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : subData.consumers
              ).map((row, indx) => (
                <TableRow key={indx} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row}
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 34 * emptyRows }}>
                  <TableCell colSpan={3} aria-hidden />
                </TableRow>
              )}
            </TableBody>
            <CustomTablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={subData.consumers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  "aria-label": "rows per page",
                },
                actions: {
                  showFirstButton: true,
                  showLastButton: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Table>
        </TableContainer>
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
