import { FC } from "react";
import { Button, Grid, ListItemText } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection, CollectionActions } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import { AddressLink } from "@gemunion/mui-scanner";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IContract, IUser, IVestingSearchDto } from "@framework/types";

import { emptyVestingContract } from "../../../../../components/common/interfaces";
import { VestingDeployButton } from "../../../../../components/buttons";
import { AllowanceButton } from "../../../../../components/buttons/mechanics/common/allowance";
import { TopUpButton } from "../../../../../components/buttons/mechanics/common/top-up";
import { TransferOwnershipButton } from "../../../../../components/buttons/extensions/transfer-ownership";
import { SearchMerchantInput } from "../../../../../components/inputs/search-merchant";
import { VestingViewDialog } from "./view";

export const VestingContracts: FC = () => {
  const { profile } = useUser<IUser>();

  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
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
            <SearchMerchantInput disableClear />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(vesting => (
            <StyledListItem key={vesting.id} wrap>
              <ListItemText sx={{ width: 0.5 }}>
                <AddressLink address={vesting.parameters.account as string} />
              </ListItemText>
              <ListActions dataTestId="VestingActionsMenuButton">
                <ListAction onClick={handleView(vesting)} message="form.tips.view" icon={Visibility} />
                <AllowanceButton contract={vesting} />
                <TopUpButton contract={vesting} />
                <TransferOwnershipButton contract={vesting} />
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

      <VestingViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={action === CollectionActions.view}
        initialValues={selected}
      />
    </Grid>
  );
};
