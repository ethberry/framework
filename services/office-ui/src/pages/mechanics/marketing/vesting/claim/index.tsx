import { FC } from "react";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import { getEmptyTemplate } from "@gemunion/mui-inputs-asset";
import { AddressLink } from "@gemunion/mui-scanner";
import { cleanUpAsset } from "@framework/exchange";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IClaimSearchDto, IUser } from "@framework/types";
import { ClaimStatus, TokenType } from "@framework/types";

import { VestingClaimUploadButton } from "../../../../../components/buttons";
import { SearchMerchantInput } from "../../../../../components/inputs/search-merchant";
import { VestingClaimEditDialog } from "./edit";

export const VestingClaim: FC = () => {
  const { profile } = useUser<IUser>();

  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleCreate,
    handleToggleFilters,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleSearch,
    handleChangePage,
    handleRefreshPage,
  } = useCollection<any, IClaimSearchDto>({
    baseUrl: "/vesting/claims",
    empty: {
      parameters: {
        owner: "",
        startTimestamp: new Date().toISOString(),
        cliffInMonth: 12,
        monthlyRelease: 1000,
      },
      item: getEmptyTemplate(TokenType.ERC20),
    },
    search: {
      account: "",
      claimStatus: [ClaimStatus.NEW],
      merchantId: profile.merchantId,
    },
    filter: ({ item, parameters }) => ({
      parameters: {
        owner: parameters.owner,
        monthlyRelease: parameters.monthlyRelease,
        cliffInMonth: parameters.cliffInMonth,
        startTimestamp: parameters.startTimestamp,
      },
      item: cleanUpAsset(item),
    }),
  });

  const { formatMessage } = useIntl();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "vesting", "vesting.claims"]} />

      <PageHeader message="pages.vesting.claims.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <VestingClaimUploadButton onRefreshPage={handleRefreshPage} />
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="ClaimCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        name="account"
        testId="VestingClaimSearchForm"
      >
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SearchMerchantInput disableClear />
          </Grid>
          <Grid item xs={12}>
            <SelectInput multiple name="claimStatus" options={ClaimStatus} />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(vesting => (
            <StyledListItem key={vesting.id} wrap>
              <ListItemText sx={{ width: 0.5 }}>
                <AddressLink address={vesting.account as string} length={42} />
              </ListItemText>
              <ListActions>
                <ListAction
                  onClick={handleEdit(vesting)}
                  icon={Create}
                  message="form.buttons.edit"
                  disabled={vesting.claimStatus !== ClaimStatus.NEW}
                />
                <ListAction
                  onClick={handleDelete(vesting)}
                  icon={Delete}
                  message="form.buttons.delete"
                  disabled={vesting.claimStatus !== ClaimStatus.NEW}
                />
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

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={isDeleteDialogOpen}
        initialValues={{
          ...selected,
          title: formatMessage({ id: "pages.claims.defaultItemTitle" }, { account: selected.account }),
        }}
      />

      <VestingClaimEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
