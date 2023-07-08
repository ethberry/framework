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
import type { IWaitListList } from "@framework/types";
import { ContractStatus } from "@framework/types";

import { WaitListListActionsMenu } from "../../../../components/menu/mechanics/waitlist-list";
import { cleanUpAsset } from "../../../../utils/money";
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
      isPrivate: false,
    },
    search: {
      query: "",
    },
    filter: ({ id, title, description, contractId, isPrivate, item }) =>
      id
        ? {
            title,
            description,
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
      <Breadcrumbs path={["dashboard", "waitlist", "waitlist.list"]} />

      <PageHeader message="pages.waitlist.list.title">
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="WaitListListCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <WaitListSearchForm onSubmit={handleSearch} initialValues={search} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((waitListList, i) => (
            <ListItem key={i}>
              <ListItemText>{waitListList.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(waitListList)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(waitListList)}>
                  <Delete />
                </IconButton>
                <WaitListListActionsMenu
                  waitListList={waitListList}
                  disabled={!!waitListList.root || waitListList.contract.contractStatus !== ContractStatus.ACTIVE}
                />
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
        testId="WaitListListEditDialog"
        initialValues={selected}
      />
    </Fragment>
  );
};
