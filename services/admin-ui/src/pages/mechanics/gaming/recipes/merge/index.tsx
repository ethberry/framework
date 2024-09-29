import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { SelectInput } from "@ethberry/mui-inputs-core";
import { CommonSearchForm } from "@ethberry/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { DeleteDialog } from "@ethberry/mui-dialog-delete";
import { useCollection, CollectionActions } from "@ethberry/provider-collection";
import { getEmptyTemplate } from "@ethberry/mui-inputs-asset";
import { cleanUpAsset, formatItem } from "@framework/exchange";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IMerge, IMergeSearchDto } from "@framework/types";
import { MergeStatus, TokenType } from "@framework/types";

import { MergeEditDialog } from "./edit";

export const Merge: FC = () => {
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
  } = useCollection<IMerge, IMergeSearchDto>({
    baseUrl: "/recipes/merge",
    empty: {
      price: getEmptyTemplate(TokenType.ERC721),
      item: getEmptyTemplate(TokenType.ERC721),
      mergeStatus: MergeStatus.ACTIVE,
    },
    search: {
      query: "",
      mergeStatus: [MergeStatus.ACTIVE],
    },
    filter: ({ id, item, price, mergeStatus }) =>
      id
        ? {
            item: cleanUpAsset(item),
            price: cleanUpAsset(price),
            mergeStatus,
          }
        : {
            item: cleanUpAsset(item),
            price: cleanUpAsset(price),
          },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "recipes", "recipes.merge"]} />

      <PageHeader message="pages.recipes.merge.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="MergeCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} testId="ExchangeSearchForm">
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput multiple name="mergeStatus" options={MergeStatus} />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(merge => (
            <StyledListItem key={merge.id} wrap>
              <ListItemText sx={{ flex: "0 1 45%" }}>{formatItem(merge.price)}</ListItemText>
              <ListItemText sx={{ flex: "0 1 45%" }}>{formatItem(merge.item)}</ListItemText>
              <ListActions>
                <ListAction
                  onClick={handleEdit(merge)}
                  message="form.buttons.edit"
                  dataTestId="MergeEditButton"
                  icon={Create}
                />
                <ListAction
                  onClick={handleDelete(merge)}
                  message="form.buttons.delete"
                  dataTestId="MergeDeleteButton"
                  icon={Delete}
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
        initialValues={{ ...selected, title: selected.item?.components[0]?.template?.title }}
      />

      <MergeEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
