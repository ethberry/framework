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
import type { IDismantle, IDismantleSearchDto } from "@framework/types";
import { DismantleStatus, DismantleStrategy, TokenType } from "@framework/types";

import { DismantleEditDialog } from "./edit";

export const Dismantle: FC = () => {
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
  } = useCollection<IDismantle, IDismantleSearchDto>({
    baseUrl: "/recipes/dismantle",
    empty: {
      price: getEmptyTemplate(TokenType.ERC721),
      item: getEmptyTemplate(TokenType.ERC1155),
      dismantleStatus: DismantleStatus.ACTIVE,
      dismantleStrategy: DismantleStrategy.FLAT,
      rarityMultiplier: 0,
    },
    search: {
      query: "",
      dismantleStatus: [DismantleStatus.ACTIVE],
    },
    filter: ({ id, item, price, dismantleStatus, rarityMultiplier, dismantleStrategy }) =>
      id
        ? {
            item: cleanUpAsset(item),
            price: cleanUpAsset(price),
            dismantleStatus,
            rarityMultiplier,
            dismantleStrategy,
          }
        : {
            item: cleanUpAsset(item),
            price: cleanUpAsset(price),
            rarityMultiplier,
            dismantleStrategy,
          },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "recipes", "recipes.dismantle"]} />

      <PageHeader message="pages.recipes.dismantle.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="DismantleCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} testId="ExchangeSearchForm">
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput multiple name="dismantleStatus" options={DismantleStatus} />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(dismantle => (
            <StyledListItem key={dismantle.id} wrap>
              <ListItemText sx={{ flex: "0 1 45%" }}>{formatItem(dismantle.price)}</ListItemText>
              <ListItemText sx={{ flex: "0 1 45%" }}>{formatItem(dismantle.item)}</ListItemText>
              <ListActions>
                <ListAction
                  onClick={handleEdit(dismantle)}
                  message="form.buttons.edit"
                  dataTestId="DismantleEditButton"
                  icon={Create}
                />
                <ListAction
                  onClick={handleDelete(dismantle)}
                  message="form.buttons.delete"
                  dataTestId="DismantleDeleteButton"
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

      <DismantleEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
