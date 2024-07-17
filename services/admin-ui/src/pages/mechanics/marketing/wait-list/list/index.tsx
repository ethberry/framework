import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, ListItemText } from "@mui/material";
import { Add, Create, Delete } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { CollectionActions, useCollection } from "@gemunion/react-hooks";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import type { ISearchDto } from "@gemunion/types-collection";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { emptyItem } from "@gemunion/mui-inputs-asset";
import { cleanUpAsset } from "@framework/exchange";
import {
  ListAction,
  ListActions,
  ListItem,
  ListItemProvider,
  StyledListWrapper,
  StyledPagination,
} from "@framework/styled";
import type { IAccessControl, IWaitListList } from "@framework/types";

import {
  WaitListListCreateButton,
  WaitListListGenerateButton,
  WaitListListUploadButton,
} from "../../../../../components/buttons";
import { WaitListListEditDialog } from "./edit";
import { useCheckPermissions } from "../../../../../shared";

export const WaitListList: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
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

  const { checkPermissions } = useCheckPermissions();
  const { account = "" } = useWeb3React();

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "wait-list", "wait-list.list"]} />

      <PageHeader message="pages.wait-list.list.title">
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="WaitListListCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} testId="WaitListListSearchForm" />

      <ListItemProvider<IAccessControl> callback={checkPermissions}>
        <ProgressOverlay isLoading={isLoading}>
          <StyledListWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(waitListList => (
              <ListItem key={waitListList.id} account={account} contract={waitListList.contract}>
                <ListItemText>{waitListList.title}</ListItemText>
                <ListActions dataTestId="WaitListActionsMenuButton">
                  <ListAction
                    onClick={handleEdit(waitListList)}
                    message="form.buttons.edit"
                    dataTestId="WaitListEditButton"
                    icon={Create}
                  />
                  <ListAction
                    onClick={handleDelete(waitListList)}
                    message="form.buttons.delete"
                    dataTestId="WaitListDeleteButton"
                    icon={Delete}
                  />
                  <WaitListListCreateButton waitListList={waitListList} onRefreshPage={handleRefreshPage} />
                  <WaitListListUploadButton waitListList={waitListList} onRefreshPage={handleRefreshPage} />
                  <WaitListListGenerateButton waitListList={waitListList} onRefreshPage={handleRefreshPage} />
                </ListActions>
              </ListItem>
            ))}
          </StyledListWrapper>
        </ProgressOverlay>
      </ListItemProvider>

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
        initialValues={selected}
      />

      <WaitListListEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        testId="WaitListListEditDialog"
        initialValues={selected}
      />
    </Fragment>
  );
};
