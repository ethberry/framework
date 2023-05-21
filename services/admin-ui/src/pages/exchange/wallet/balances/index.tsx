import { FC, useState } from "react";

import { Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { AccountBalanceWallet } from "@mui/icons-material";

import { useCollection } from "@gemunion/react-hooks";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { ContractFeatures, IContract, IContractSearchDto } from "@framework/types";
import { BalanceWithdrawDialog } from "./withdraw-dialog";
import { CommonActionsMenu } from "../../../../components/menu/mechanics/common";

export const SystemContracts: FC = () => {
  const { rows, count, search, isLoading, handleChangePage } = useCollection<IContract, IContractSearchDto>({
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
      <PageHeader message="pages.wallet.balances.title" />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((contract, i) => (
            <ListItem key={i}>
              <ListItemText sx={{ width: 0.4 }}>{contract.title}</ListItemText>
              <ListItemText sx={{ width: 0.6 }}>{contract.address}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleWithdraw(contract)}>
                  <AccountBalanceWallet />
                </IconButton>
                <CommonActionsMenu contract={contract} />
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
