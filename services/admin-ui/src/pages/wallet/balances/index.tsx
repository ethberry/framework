import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Contract, constants } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";

import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Pagination,
} from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";

import { useCollection } from "@gemunion/react-hooks";
import { IBalance, IBalanceSearchDto, TokenType } from "@framework/types";
import { formatEther } from "../../../utils/money";
import { emptyToken } from "../../../components/inputs/price/empty-token";
import { BalanceSearchForm } from "./form";
import { BalanceWithdrawDialog, IBalanceWithdrawDto } from "./withdraw-dialog";
import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

export const SystemBalances: FC = () => {
  const { rows, count, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch, handleChangePage } =
    useCollection<IBalance, IBalanceSearchDto>({
      baseUrl: "/wallet/balances",
      empty: {
        account: "",
        amount: "",
        token: emptyToken,
      },
      search: {
        maxBalance: constants.WeiPerEther.mul(1000).toString(),
        minBalance: constants.Zero.toString(),
      },
      filter: ({ account, amount, token }) => ({
        account,
        amount,
        token,
      }),
    });

  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);

  const [balance, setBalance] = useState<IBalance>({
    account: "",
    amount: "",
    token: emptyToken,
    tokenId: 0,
    id: 0,
    createdAt: "",
    updatedAt: "",
  });

  const handleWithdraw = (balance: IBalance): (() => Promise<void>) => {
    return (): Promise<void> => {
      setBalance(balance);
      setIsWithdrawDialogOpen(true);
      // to promisify Withdraw?
      return Promise.resolve();
    };
  };

  const metaFn = useMetamask((data: IBalanceWithdrawDto, web3Context: Web3ContextType) => {
    if (balance.token?.template!.contract!.contractType === TokenType.ERC20) {
      const contract = new Contract(balance.account, ExchangeSol.abi, web3Context.provider?.getSigner());
      return contract["release(address,address)"](balance.token?.template.contract.address, data.payee) as Promise<any>;
    } else {
      // TODO NATIVE type check?
      const contract = new Contract(balance.account, ExchangeSol.abi, web3Context.provider?.getSigner());
      return contract["release(address)"](data.payee) as Promise<any>;
    }
  });

  const handleWithdrawConfirm = async (values: IBalanceWithdrawDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsWithdrawDialogOpen(false);
    });
  };

  const handleWithdrawCancel = () => {
    setIsWithdrawDialogOpen(false);
  };

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "wallet", "wallet.balances"]} />
      <PageHeader message="pages.wallet.balances.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>
      <BalanceSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />
      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((balance, i) => (
            <ListItem key={i}>
              <ListItemText sx={{ width: 0.6 }}>{balance.token!.template!.title}</ListItemText>
              <ListItemText>
                {formatEther(
                  balance.amount,
                  balance.token!.template!.contract!.decimals,
                  balance.token!.template!.contract!.symbol,
                )}
              </ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleWithdraw(balance)}>
                  <Visibility />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>
      <Pagination
        sx={{ mt: 2 }}
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />
      <BalanceWithdrawDialog
        onConfirm={handleWithdrawConfirm}
        onCancel={handleWithdrawCancel}
        open={isWithdrawDialogOpen}
        initialValues={{ balance, payee: "" }}
      />
    </Grid>
  );
};
