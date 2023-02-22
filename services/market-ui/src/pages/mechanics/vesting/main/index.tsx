import { FC, Fragment, useState } from "react";
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination, Tooltip } from "@mui/material";
import { AccountBalanceWallet, Visibility } from "@mui/icons-material";
import { useIntl } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { AddressLink } from "@gemunion/mui-scanner";

import type { IContract, IVestingParams, IVestingSearchDto } from "@framework/types";

import { VestingTransferOwnershipButton } from "../../../../components/buttons/mechanics/vesting/transfer-ownership";
import { emptyVestingContract } from "../../../../components/common/interfaces/empty-contract";
import { BalanceWithdrawDialog } from "./withdraw-dialog";
import { VestingViewDialog } from "./view";
import { formatDistance } from "date-fns";

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

  const { formatMessage } = useIntl();

  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);

  const [contract, setContract] = useState<IContract>({} as IContract);

  const handleWithdraw = (contract: IContract): (() => void) => {
    return (): void => {
      setContract(contract);
      setIsWithdrawDialogOpen(true);
    };
  };

  const getDistance = (contract: IContract): string => {
    const { duration, startTimestamp } = contract.parameters as IVestingParams;
    const dateStart = new Date(startTimestamp);
    const dateFinish = new Date(dateStart.getTime() + duration);
    return formatDistance(dateFinish, Date.now(), { addSuffix: true });
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
        <List sx={{ overflowX: "scroll" }}>
          {rows.map((vesting, i) => (
            <ListItem key={i} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: 0.5 }}>
                <AddressLink address={vesting.parameters.account as string} />
              </ListItemText>
              <ListItemText sx={{ width: 0.2 }}>{getDistance(vesting)}</ListItemText>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{vesting.contractFeatures.join(", ")}</ListItemText>
              <ListItemSecondaryAction
                sx={{
                  top: { xs: "80%", sm: "50%" },
                  transform: { xs: "translateY(-80%)", sm: "translateY(-50%)" },
                }}
              >
                <VestingTransferOwnershipButton vesting={vesting} />
                <IconButton onClick={handleWithdraw(vesting)}>
                  <AccountBalanceWallet />
                </IconButton>
                <Tooltip title={formatMessage({ id: "form.tips.view" })}>
                  <IconButton onClick={handleView(vesting)}>
                    <Visibility />
                  </IconButton>
                </Tooltip>
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
