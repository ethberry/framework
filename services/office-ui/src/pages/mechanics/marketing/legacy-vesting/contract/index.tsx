import { FC } from "react";
import { Button, Grid, ListItemText } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { SelectInput } from "@ethberry/mui-inputs-core";
import { useCollection, CollectionActions } from "@ethberry/provider-collection";
import { useUser } from "@ethberry/provider-user";
import { AddressLink } from "@ethberry/mui-scanner";
import { CommonSearchForm } from "@ethberry/mui-form-search";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IContract, IUser, ILegacyVestingContractSearchDto } from "@framework/types";
import { LegacyVestingContractFeatures } from "@framework/types";

import { emptyVestingContract } from "../../../../../components/common/interfaces";
import {
  LegacyVestingDeployButton,
  AllowanceButton,
  TopUpButton,
  TransferOwnershipButton,
} from "../../../../../components/buttons";
import { SearchMerchantInput } from "../../../../../components/inputs/search-merchant";
import { LegacyVestingViewDialog } from "./view";

export const LegacyVestingContracts: FC = () => {
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
  } = useCollection<IContract, ILegacyVestingContractSearchDto>({
    baseUrl: "/legacy-vesting/contracts",
    search: {
      account: "",
      contractFeatures: [],
      merchantId: profile.merchantId,
    },
    empty: emptyVestingContract,
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "legacy-vesting", "legacy-vesting.contracts"]} />

      <PageHeader message="pages.legacy-vesting.contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <LegacyVestingDeployButton />
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} name="account">
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SearchMerchantInput disableClear />
          </Grid>
          <Grid item xs={12}>
            <SelectInput name="contractFeatures" options={LegacyVestingContractFeatures} multiple />
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

      <LegacyVestingViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={action === CollectionActions.view}
        initialValues={selected}
      />
    </Grid>
  );
};
