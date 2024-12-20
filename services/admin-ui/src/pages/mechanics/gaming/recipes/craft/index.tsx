import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection, CollectionActions } from "@gemunion/provider-collection";
import { getEmptyTemplate } from "@gemunion/mui-inputs-asset";
import { cleanUpAsset, formatItem } from "@framework/exchange";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { ICraft, ICraftSearchDto } from "@framework/types";
import { CraftStatus, TokenType } from "@framework/types";

import { CraftEditDialog } from "./edit";

export const Craft: FC = () => {
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
  } = useCollection<ICraft, ICraftSearchDto>({
    baseUrl: "/recipes/craft",
    empty: {
      item: getEmptyTemplate(TokenType.ERC721),
      price: getEmptyTemplate(TokenType.ERC1155),
    },
    search: {
      query: "",
      craftStatus: [CraftStatus.ACTIVE],
    },
    filter: ({ item, price, craftStatus }) => ({
      item: cleanUpAsset(item),
      price: cleanUpAsset(price),
      craftStatus,
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "recipes", "recipes.craft"]} />

      <PageHeader message="pages.recipes.craft.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="CraftCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} testId="ExchangeSearchForm">
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput multiple name="craftStatus" options={CraftStatus} />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(craft => (
            <StyledListItem key={craft.id} wrap>
              <ListItemText sx={{ width: 0.3, px: 0.5 }}>{formatItem(craft.price)}</ListItemText>
              <ListItemText sx={{ width: 0.3, px: 0.5 }}>{formatItem(craft.item)}</ListItemText>
              <ListActions>
                <ListAction
                  onClick={handleEdit(craft)}
                  message="form.buttons.edit"
                  dataTestId="CraftEditButton"
                  icon={Create}
                />
                <ListAction
                  onClick={handleDelete(craft)}
                  message="form.buttons.delete"
                  dataTestId="CraftDeleteButton"
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

      <CraftEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
