import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";

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
import { AccountBalanceWallet, FilterList } from "@mui/icons-material";

import { useCollection } from "@gemunion/react-hooks";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { ContractFeatures, IContract, IContractSearchDto } from "@framework/types";
import { BalanceWithdrawDialog } from "./withdraw-dialog";

export const SystemContracts: FC = () => {
  const { rows, count, search, isLoading, isFiltersOpen, handleToggleFilters, handleChangePage } = useCollection<
    IContract,
    IContractSearchDto
  >({
    baseUrl: "/contracts",
    search: {
      contractFeatures: [ContractFeatures.WITHDRAW],
    },
    redirect: () => "/wallet/balances",
  });

  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);

  const [contract, setContract] = useState<IContract>({} as IContract);

  const handleWithdraw = (contract: IContract): (() => void) => {
    return (): void => {
      setContract(contract);
      setIsWithdrawDialogOpen(true);
    };
  };

  const handleWithdrawConfirm = () => {
    setIsWithdrawDialogOpen(false);
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

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((contract, i) => (
            <ListItem key={i}>
              <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleWithdraw(contract)}>
                  <AccountBalanceWallet />
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
        initialValues={contract}
      />
    </Grid>
  );
};
