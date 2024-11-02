import { FC, Fragment, useState } from "react";
import { ListItemText } from "@mui/material";
import { AccountBalanceWallet, Visibility } from "@mui/icons-material";
import { addMonths, formatDistance } from "date-fns";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { useCollection, CollectionActions } from "@ethberry/provider-collection";
import { AddressLink } from "@ethberry/mui-scanner";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IContract, ILegacyVestingContractSearchDto } from "@framework/types";

import { LegacyVestingTransferOwnershipButton } from "../../../../../components/buttons";
import { emptyVestingContract } from "../../../../../components/common/interfaces";
import { BalanceWithdrawDialog } from "./withdraw-dialog";
import { LegacyVestingViewDialog } from "./view";

export const LegacyVesting: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    handleView,
    handleViewConfirm,
    handleViewCancel,
    handleChangePage,
  } = useCollection<IContract, ILegacyVestingContractSearchDto>({
    baseUrl: "/legacy-vesting",
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
      <Breadcrumbs path={["dashboard", "legacy-vesting"]} />

      <PageHeader message="pages.legacy-vesting.title" />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(vesting => (
            <StyledListItem key={vesting.id}>
              <ListItemText sx={{ width: 0.6 }}>
                <AddressLink length={42} address={vesting.parameters.account as string} />
              </ListItemText>
              <ListItemText sx={{ width: 0.4 }}>
                {vesting.parameters.startTimestamp && vesting.parameters.monthlyRelease
                  ? formatDistance(
                      addMonths(
                        new Date(vesting.parameters.startTimestamp),
                        Math.ceil(10000 / vesting.parameters.monthlyRelease),
                      ),
                      Date.now(),
                      { addSuffix: true },
                    )
                  : ""}
              </ListItemText>
              <ListActions>
                <ListAction
                  onClick={handleWithdraw(vesting)}
                  icon={AccountBalanceWallet}
                  message="form.buttons.withdraw"
                />
                <ListAction onClick={handleView(vesting)} message="form.tips.view" icon={Visibility} />
                <LegacyVestingTransferOwnershipButton vesting={vesting} />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <LegacyVestingViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={action === CollectionActions.view}
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
