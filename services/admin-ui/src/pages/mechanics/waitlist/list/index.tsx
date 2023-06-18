import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { Add, Create, Delete } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import type { ISearchDto } from "@gemunion/types-collection";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { emptyItem } from "@gemunion/mui-inputs-asset";
import { IWaitListList } from "@framework/types";

import { WaitListSearchForm } from "./form";
import { WaitListListEditDialog } from "./edit";

export const WaitListList: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleEdit,
    handleCreate,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IWaitListList, ISearchDto>({
    baseUrl: "/waitlist/list",
    empty: {
      title: "",
      description: emptyStateString,
      item: emptyItem,
    },
    search: {
      query: "",
    },
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "waitlist", "waitlist.list"]} />

      <PageHeader message="pages.waitlist.list.title">
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="WaitListCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <WaitListSearchForm onSubmit={handleSearch} initialValues={search} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((waitListItem, i) => (
            <ListItem key={i}>
              <ListItemText>{waitListItem.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(waitListItem)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(waitListItem)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
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
        message={selected.id ? "dialogs.edit" : "dialogs.create"}
        testId="WaitListListEditDialog"
        initialValues={selected}
      />
    </Fragment>
  );
};
