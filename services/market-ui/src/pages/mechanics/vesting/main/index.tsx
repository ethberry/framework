import { FC, Fragment } from "react";
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { IVesting, IVestingSearchDto } from "@framework/types";
import { VestingViewDialog } from "./view";
import { VestingTransferOwnershipButton } from "../../../../components/buttons/mechanics/vesting/transfer-ownership";
import { VestingReleaseButton } from "../../../../components/buttons";

export const Vesting: FC = () => {
  const { account } = useWeb3React();

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
  } = useCollection<IVesting, IVestingSearchDto>({
    baseUrl: `/vesting`,
    search: {
      account,
    },
    empty: {
      account: "",
      duration: 0,
      startTimestamp: new Date().toISOString(),
    },
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "vesting"]} />

      <PageHeader message="pages.vesting.title" />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((vesting, i) => (
            <ListItem key={i}>
              <ListItemText sx={{ width: 0.6 }}>{vesting.account}</ListItemText>
              <ListItemText>{vesting.contractTemplate}</ListItemText>
              <ListItemSecondaryAction>
                <VestingTransferOwnershipButton vesting={vesting} />
                <VestingReleaseButton vesting={vesting} />
                <IconButton onClick={handleView(vesting)}>
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

      <VestingViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Fragment>
  );
};
