import { FC } from "react";
import { Grid, List, ListItem, ListItemText, Pagination } from "@mui/material";
import { Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { AddressLink } from "@gemunion/mui-scanner";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import type { IContract, IVestingSearchDto } from "@framework/types";

import { emptyVestingContract } from "../../../../components/common/interfaces";
import { VestingDeployButton } from "../../../../components/buttons";
import { AllowanceMenuItem } from "../../../../components/menu/mechanics/common/allowance";
import { TopUpMenuItem } from "../../../../components/menu/mechanics/common/top-up";
import { TransferOwnershipMenuItem } from "../../../../components/menu/extensions/transfer-ownership";
import { ListAction, ListActions } from "../../../../components/common/lists";
import { VestingViewDialog } from "./view";

export const VestingContracts: FC = () => {
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
    handleSearch,
    handleChangePage,
  } = useCollection<IContract, IVestingSearchDto>({
    baseUrl: "/vesting/contracts",
    search: {
      account: "",
    },
    empty: emptyVestingContract,
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "vesting", "vesting.contracts"]} />

      <PageHeader message="pages.vesting.contracts.title">
        <VestingDeployButton />
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} name="account" />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(vesting => (
            <ListItem key={vesting.id} sx={{ flexWrap: "wrap", pr: 0 }}>
              <ListItemText sx={{ mr: 0.5, overflowX: "scroll", width: 0.5 }}>
                <AddressLink address={vesting.parameters.account as string} />
              </ListItemText>
              <ListActions dataTestId="VestingActionsMenuButton">
                <ListAction onClick={handleView(vesting)} icon={Visibility} message="form.tips.view" />
                <AllowanceMenuItem contract={vesting} />
                <TopUpMenuItem contract={vesting} />
                <TransferOwnershipMenuItem contract={vesting} />
              </ListActions>
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
    </Grid>
  );
};
