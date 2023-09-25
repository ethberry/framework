import { FC, Fragment, useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { AccountBalanceWallet, Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { AddressLink } from "@gemunion/mui-scanner";
import { ListAction, ListActions } from "@framework/mui-lists";
import { StyledPagination } from "@framework/styled";
import type { IContract, IVestingSearchDto } from "@framework/types";

import { VestingTransferOwnershipButton } from "../../../../components/buttons/mechanics/vesting/transfer-ownership";
import { emptyVestingContract } from "../../../../components/common/interfaces";
import { BalanceWithdrawDialog } from "./withdraw-dialog";
import { VestingViewDialog } from "./view";

export const Vesting: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isViewDialogOpen,
    handleView,
    handleViewConfirm,
    handleViewCancel,
    handleChangePage,
  } = useCollection<IContract, IVestingSearchDto>({
    baseUrl: `/vesting`,
    empty: emptyVestingContract,
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
    <Fragment>
      <Breadcrumbs path={["dashboard", "vesting"]} />

      <PageHeader message="pages.vesting.title" />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(vesting => (
            <ListItem key={vesting.id} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ overflowX: "auto", width: 0.5 }}>
                <AddressLink address={vesting.parameters.account as string} />
              </ListItemText>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{vesting.contractFeatures.join(", ")}</ListItemText>
              <ListActions>
                <ListAction
                  onClick={handleWithdraw(vesting)}
                  icon={AccountBalanceWallet}
                  message="form.buttons.withdraw"
                />
                <ListAction onClick={handleView(vesting)} icon={Visibility} message="form.tips.view" />
                <VestingTransferOwnershipButton vesting={vesting} />
              </ListActions>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <VestingViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />

      <BalanceWithdrawDialog
        onConfirm={handleWithdrawConfirm}
        onCancel={handleWithdrawCancel}
        open={isWithdrawDialogOpen}
        initialValues={contract}
      />
    </Fragment>
  );
};
