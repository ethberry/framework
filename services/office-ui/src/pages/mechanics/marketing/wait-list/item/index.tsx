import { FC, Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Delete, FilterList } from "@mui/icons-material";

import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection, CollectionActions } from "@gemunion/provider-collection";
import { useUser } from "@gemunion/provider-user";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IWaitListItem, IWaitListItemSearchDto } from "@framework/types";
import { ContractStatus, IUser } from "@framework/types";

import { SearchMerchantInput } from "../../../../../components/inputs/search-merchant";
import { WaitListItemEditDialog } from "./edit";
import { WaitListInput } from "./list-input";

export const WaitListItem: FC = () => {
  const { profile } = useUser<IUser>();

  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
    handleCreate,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
    handleToggleFilters,
  } = useCollection<IWaitListItem, IWaitListItemSearchDto>({
    baseUrl: "/wait-list/item",
    empty: {
      account: "",
    },
    search: {
      account: "",
      listIds: [],
      merchantId: profile.merchantId,
    },
  });

  const { formatMessage } = useIntl();

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "wait-list", "wait-list.item"]} />

      <PageHeader message="pages.wait-list.item.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="WaitListItemCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        testId="WaitListItemSearchForm"
      >
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <SearchMerchantInput disableClear />
          </Grid>
          <Grid item xs={6}>
            <WaitListInput />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(waitListItem => (
            <StyledListItem key={waitListItem.id} wrap>
              <ListItemText sx={{ width: 0.6 }}>{waitListItem.account}</ListItemText>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{waitListItem.list?.title}</ListItemText>
              <ListActions>
                <ListAction
                  onClick={handleDelete(waitListItem)}
                  message="form.buttons.delete"
                  dataTestId="WaitListDeleteButton"
                  icon={Delete}
                  disabled={
                    !!waitListItem.list?.root || waitListItem.list?.contract.contractStatus !== ContractStatus.ACTIVE
                  }
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
          title: formatMessage({ id: "pages.wait-list.item.defaultItemTitle" }, { account: selected.account }),
        }}
      />

      <WaitListItemEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        testId="WaitListEditDialog"
        initialValues={selected}
      />
    </Fragment>
  );
};
