import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText, Pagination } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { emptyItem } from "@gemunion/mui-inputs-asset";
import type { IUser, IWaitListList, IWaitListListSearchDto } from "@framework/types";
import { ContractStatus } from "@framework/types";

import { cleanUpAsset } from "../../../../utils/money";
import { ListAction, ListActions } from "../../../../components/common/lists";
import { CreateMenuItem } from "../../../../components/menu/mechanics/wait-list-list/create";
import { UploadMenuItem } from "../../../../components/menu/mechanics/wait-list-list/upload";
import { GenerateMenuItem } from "../../../../components/menu/mechanics/wait-list-list/generate";
import { WaitListListEditDialog } from "./edit";

export const WaitListList: FC = () => {
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
    handleEdit,
    handleCreate,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleToggleFilters,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IWaitListList, IWaitListListSearchDto>({
    baseUrl: "/wait-list/list",
    empty: {
      title: "",
      description: emptyStateString,
      item: emptyItem,
      isPrivate: false,
    },
    search: {
      query: "",
      merchantId: profile.merchantId,
    },
    filter: ({ id, title, description, contractId, isPrivate, item }) =>
      id
        ? {
            title,
            description,
            isPrivate,
          }
        : {
            title,
            description,
            contractId,
            isPrivate,
            item: cleanUpAsset(item),
          },
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "wait-list", "wait-list.list"]} />

      <PageHeader message="pages.wait-list.list.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="WaitListListCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        testId="WaitListListSearchForm"
      >
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput name="merchantId" controller="merchants" disableClear />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(waitListList => (
            <ListItem key={waitListList.id}>
              <ListItemText>{waitListList.title}</ListItemText>
              <ListActions dataTestId="WaitListActionsMenuButton">
                <ListAction onClick={handleEdit(waitListList)} icon={Create} message="form.buttons.edit" />
                <ListAction onClick={handleDelete(waitListList)} icon={Delete} message="form.buttons.delete" />
                <CreateMenuItem
                  waitListList={waitListList}
                  disabled={!!waitListList.root || waitListList.contract.contractStatus !== ContractStatus.ACTIVE}
                />
                <UploadMenuItem
                  waitListList={waitListList}
                  disabled={!!waitListList.root || waitListList.contract.contractStatus !== ContractStatus.ACTIVE}
                />
                <GenerateMenuItem
                  waitListList={waitListList}
                  disabled={!!waitListList.root || waitListList.contract.contractStatus !== ContractStatus.ACTIVE}
                />
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

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={isDeleteDialogOpen}
        initialValues={selected}
      />

      <WaitListListEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        testId="WaitListListEditDialog"
        initialValues={selected}
      />
    </Fragment>
  );
};
