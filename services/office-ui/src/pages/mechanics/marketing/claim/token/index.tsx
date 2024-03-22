import { FC, Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyToken } from "@gemunion/mui-inputs-asset";
import { useUser } from "@gemunion/provider-user";
import { cleanUpAsset } from "@framework/exchange";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IClaim, IClaimSearchDto, IUser } from "@framework/types";
import { ClaimStatus, ClaimType } from "@framework/types";

import { ClaimUploadButton } from "../../../../../components/buttons";
import { FormRefresher } from "../../../../../components/forms/form-refresher";
import { SearchMerchantInput } from "../../../../../components/inputs/search-merchant";
import { ClaimTokenEditDialog } from "./edit";

export const ClaimToken: FC = () => {
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
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
    handleRefreshPage,
  } = useCollection<IClaim, IClaimSearchDto>({
    baseUrl: "/claims/tokens",
    empty: {
      account: "",
      item: emptyToken,
      claimType: ClaimType.TOKEN,
      endTimestamp: new Date(0).toISOString(),
      merchantId: profile.merchantId,
    },
    search: {
      account: "",
      claimStatus: [],
      merchantId: profile.merchantId,
    },
    filter: ({ item, claimType, account, endTimestamp, merchantId }) => ({
      item: cleanUpAsset(item),
      claimType,
      account,
      endTimestamp,
      merchantId,
    }),
  });

  const { formatMessage } = useIntl();
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "claims", "claims.token"]} />

      <PageHeader message="pages.claims.token.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <ClaimUploadButton onRefreshPage={handleRefreshPage} claimType={ClaimType.TOKEN} />
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="ClaimCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        name="account"
        testId="ClaimSearchForm"
      >
        <FormRefresher onRefreshPage={handleRefreshPage} />
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
          {rows.map(claim => (
            <StyledListItem key={claim.id} wrap>
              <ListItemText sx={{ width: 0.6 }}>{claim.account}</ListItemText>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>
                {claim.item.components.map(component => component.template?.title).join(", ")}
              </ListItemText>
              <ListActions>
                <ListAction
                  onClick={handleEdit(claim)}
                  icon={Create}
                  message="form.buttons.edit"
                  disabled={claim.claimStatus !== ClaimStatus.NEW}
                />
                <ListAction
                  onClick={handleDelete(claim)}
                  icon={Delete}
                  message="form.buttons.delete"
                  disabled={claim.claimStatus !== ClaimStatus.NEW}
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

      <ClaimTokenEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Fragment>
  );
};
