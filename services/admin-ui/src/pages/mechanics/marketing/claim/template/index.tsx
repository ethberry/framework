import { FC, Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection, CollectionActions } from "@gemunion/provider-collection";
import { emptyItem } from "@gemunion/mui-inputs-asset";
import { cleanUpAsset } from "@framework/exchange";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IClaim, IClaimSearchDto } from "@framework/types";
import { ClaimStatus, ClaimType } from "@framework/types";

import { ClaimUploadButton } from "../../../../../components/buttons";
import { FormRefresher } from "../../../../../components/forms/form-refresher";
import { ClaimTemplateEditDialog } from "./edit";

export const ClaimTemplate: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
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
    baseUrl: "/claims/templates",
    empty: {
      account: "",
      item: emptyItem,
      claimType: ClaimType.TEMPLATE,
      endTimestamp: new Date(0).toISOString(),
    },
    search: {
      account: "",
      claimStatus: [],
    },
    filter: ({ item, claimType, account, endTimestamp }) => ({
      item: cleanUpAsset(item),
      claimType,
      account,
      endTimestamp,
    }),
  });

  const { formatMessage } = useIntl();
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "claims", "claims.template"]} />

      <PageHeader message="pages.claims.template.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <ClaimUploadButton onRefreshPage={handleRefreshPage} claimType={ClaimType.TEMPLATE} />
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
                  dataTestId="ClaimEditButton"
                  disabled={claim.claimStatus !== ClaimStatus.NEW}
                />
                <ListAction
                  onClick={handleDelete(claim)}
                  message="form.buttons.delete"
                  dataTestId="ClaimDeleteButton"
                  icon={Delete}
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
        open={action === CollectionActions.delete}
        initialValues={{
          ...selected,
          title: formatMessage({ id: "pages.claims.defaultItemTitle" }, { account: selected.account }),
        }}
      />

      <ClaimTemplateEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Fragment>
  );
};
