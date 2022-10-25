import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { constants } from "ethers";

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
import { Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { IBalance, IBalanceSearchDto, IUser } from "@framework/types";
import { formatEther } from "../../utils/money";
import { emptyToken } from "../../components/inputs/price/empty-token";
import { BalanceSearchForm } from "./form";

// import { UserEditDialog } from "./edit";
// import { BalanceSearchForm } from "./form";

export const SystemBalances: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isDeleteDialogOpen,
    handleToggleFilters,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IBalance, IBalanceSearchDto>({
    baseUrl: "/payees/balances",
    empty: {
      account: "",
      amount: "",
      token: emptyToken,
    },
    search: {
      // contractIds: [],
      // tokenIds: [],
      // accounts: [],
      maxBalance: constants.WeiPerEther.mul(1000).toString(),
      minBalance: constants.Zero.toString(),
    },
    filter: ({ account, amount, token }) => ({
      account,
      amount,
      token,
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "payees", "payees.balances"]} />
      <PageHeader message="pages.payees.balances.title">
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
                <IconButton onClick={handleDelete(balance)}>
                  <Delete />
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
      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={isDeleteDialogOpen}
        initialValues={selected}
        getTitle={(user: IUser) => user.displayName}
      />
    </Grid>
  );
};
