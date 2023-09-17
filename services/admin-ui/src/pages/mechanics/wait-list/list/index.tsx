import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, List, ListItem, ListItemText, Pagination } from "@mui/material";
import { Add, Create, Delete } from "@mui/icons-material";

import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import type { ISearchDto } from "@gemunion/types-collection";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { emptyItem } from "@gemunion/mui-inputs-asset";
import { ListAction, ListActions } from "@framework/mui-lists";
import type { IWaitListList } from "@framework/types";
import { ContractStatus } from "@framework/types";

import { cleanUpAsset } from "../../../../utils/money";
import { WaitListListCreateMenuItem } from "../../../../components/menu/mechanics/wait-list-list/create";
import { WaitListListUploadMenuItem } from "../../../../components/menu/mechanics/wait-list-list/upload";
import { WaitListListGenerateMenuItem } from "../../../../components/menu/mechanics/wait-list-list/generate";
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
    handleRefreshPage,
  } = useCollection<IWaitListList, ISearchDto>({
    baseUrl: "/wait-list/list",
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
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="WaitListListCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} testId="WaitListListSearchForm" />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(waitListList => (
            <ListItem key={waitListList.id}>
              <ListItemText>{waitListList.title}</ListItemText>
              <ListActions dataTestId="WaitListActionsMenuButton">
                <ListAction onClick={handleEdit(waitListList)} icon={Create} message="form.buttons.edit" />
                <ListAction onClick={handleDelete(waitListList)} icon={Delete} message="form.buttons.delete" />
                <WaitListListCreateMenuItem
                  waitListList={waitListList}
                  disabled={!!waitListList.root || waitListList.contract.contractStatus !== ContractStatus.ACTIVE}
                  onRefreshPage={handleRefreshPage}
                />
                <WaitListListUploadMenuItem
                  waitListList={waitListList}
                  disabled={!!waitListList.root || waitListList.contract.contractStatus !== ContractStatus.ACTIVE}
                  onRefreshPage={handleRefreshPage}
                />
                <WaitListListGenerateMenuItem
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
