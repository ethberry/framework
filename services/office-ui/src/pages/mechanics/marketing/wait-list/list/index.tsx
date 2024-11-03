import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { CommonSearchForm } from "@ethberry/mui-form-search";
import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";
import { CollectionActions, useCollection } from "@ethberry/provider-collection";
import { useUser } from "@ethberry/provider-user";
import { DeleteDialog } from "@ethberry/mui-dialog-delete";
import { emptyStateString } from "@ethberry/draft-js-utils";
import { emptyItem } from "@ethberry/mui-inputs-asset";
import { cleanUpAsset } from "@framework/exchange";
import { ListAction, ListActions, ListItem, StyledPagination } from "@framework/styled";
import type { IUser, IWaitListList, IWaitListListSearchDto } from "@framework/types";

import {
  WaitListListCreateButton,
  WaitListListGenerateButton,
  WaitListListUploadButton
} from "../../../../../components/buttons";
import { SearchMerchantInput } from "../../../../../components/inputs/search-merchant";
import { WithCheckPermissionsListWrapper } from "../../../../../components/wrappers";
import { WaitListListEditDialog } from "./edit";

export const WaitListList: FC = () => {
  const { profile } = useUser<IUser>();

  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
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
    handleRefreshPage,
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

  const { account = "" } = useWeb3React();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "wait-list", "wait-list.list"]} />

      <PageHeader message="pages.wait-list.list.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
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
            <SearchMerchantInput disableClear />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <WithCheckPermissionsListWrapper isLoading={isLoading} count={rows.length}>
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
              <WaitListListGenerateButton waitListList={waitListList} />
            </ListActions>
          </ListItem>
        ))}
      </WithCheckPermissionsListWrapper>

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
    </Grid>
  );
};
