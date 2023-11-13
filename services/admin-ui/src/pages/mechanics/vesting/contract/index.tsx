import { FC } from "react";
import { Grid, List, ListItem, ListItemText } from "@mui/material";
import { Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { AddressLink } from "@gemunion/mui-scanner";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { ListAction, ListActions, StyledPagination } from "@framework/styled";
import type { IContract, IVestingSearchDto } from "@framework/types";

import { emptyVestingContract } from "../../../../components/common/interfaces";
import { VestingDeployButton } from "../../../../components/buttons";
import { AllowanceButton } from "../../../../components/buttons/mechanics/common/allowance";
import { TopUpButton } from "../../../../components/buttons/mechanics/common/top-up";
import { TransferOwnershipButton } from "../../../../components/buttons/extensions/transfer-ownership";
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
              <ListItemText sx={{ mr: 0.5, overflowX: "auto", width: 0.5 }}>
                <AddressLink address={vesting.parameters.account as string} />
              </ListItemText>
              <ListActions dataTestId="VestingActionsMenuButton">
                <ListAction onClick={handleView(vesting)} message="form.tips.view" icon={Visibility} />
                <AllowanceButton contract={vesting} />
                <TopUpButton contract={vesting} />
                <TransferOwnershipButton contract={vesting} />
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
    </Grid>
  );
};
