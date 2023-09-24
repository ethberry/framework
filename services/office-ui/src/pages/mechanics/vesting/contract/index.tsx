import { FC } from "react";
import { Button, Grid, List, ListItem, ListItemText } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import { AddressLink } from "@gemunion/mui-scanner";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ListAction, ListActions } from "@framework/mui-lists";
import { StyledPagination } from "@framework/styled";
import type { IContract, IUser, IVestingSearchDto } from "@framework/types";

import { emptyVestingContract } from "../../../../components/common/interfaces";
import { VestingDeployButton } from "../../../../components/buttons";
import { AllowanceButton } from "../../../../components/buttons/mechanics/common/allowance";
import { TopUpButton } from "../../../../components/buttons/mechanics/common/top-up";
import { TransferOwnershipButton } from "../../../../components/buttons/extensions/transfer-ownership";
import { VestingViewDialog } from "./view";

export const VestingContracts: FC = () => {
  const { profile } = useUser<IUser>();

  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
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
      merchantId: profile.merchantId,
    },
    empty: emptyVestingContract,
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "vesting", "vesting.contracts"]} />

      <PageHeader message="pages.vesting.contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <VestingDeployButton />
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} name="account">
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput name="merchantId" controller="merchants" disableClear />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <List sx={{ overflowX: "auto" }}>
          {rows.map(vesting => (
            <ListItem key={vesting.id} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: 0.5 }}>
                <AddressLink address={vesting.parameters.account as string} />
              </ListItemText>
              <ListActions dataTestId="VestingActionsMenuButton">
                <ListAction onClick={handleView(vesting)} icon={Visibility} message="form.tips.view" />
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
