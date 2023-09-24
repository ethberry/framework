import { FC, Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText } from "@mui/material";
import { Add, Delete, FilterList } from "@mui/icons-material";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { ListAction, ListActions } from "@framework/mui-lists";
import { StyledPagination } from "@framework/styled";
import type { IWaitListItem, IWaitListItemSearchDto } from "@framework/types";
import { ContractStatus } from "@framework/types";

import { WaitListItemEditDialog } from "./edit";

export const WaitListItem: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isEditDialogOpen,
    isDeleteDialogOpen,
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
    },
  });

  const { formatMessage } = useIntl();

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "wait-list", "wait-list.item"]} />

      <PageHeader message="pages.wait-list.item.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="WaitListItemCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        name="account"
        testId="WaitListItemSearchForm"
      >
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput name="listIds" controller="wait-list/list" multiple />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <List sx={{ overflowX: "auto" }}>
          {rows.map(waitListItem => (
            <ListItem key={waitListItem.id} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: 0.6 }}>{waitListItem.account}</ListItemText>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{waitListItem.list?.title}</ListItemText>
              <ListActions>
                <ListAction
                  onClick={handleDelete(waitListItem)}
                  icon={Delete}
                  message="form.buttons.delete"
                  disabled={
                    !!waitListItem.list?.root || waitListItem.list?.contract.contractStatus !== ContractStatus.ACTIVE
                  }
                />
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

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={isDeleteDialogOpen}
        initialValues={{
          ...selected,
          title: formatMessage({ id: "pages.wait-list.item.defaultItemTitle" }, { account: selected.account }),
        }}
      />

      <WaitListItemEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        testId="WaitListEditDialog"
        initialValues={selected}
      />
    </Fragment>
  );
};
