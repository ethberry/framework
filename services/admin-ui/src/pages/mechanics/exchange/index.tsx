import { FC } from "react";
import { FormattedMessage } from "react-intl";
import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Pagination,
} from "@mui/material";

import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { ExchangeStatus, IRecipe, IExchangeSearchDto } from "@framework/types";

import { ExchangeEditDialog } from "./edit";
import { ExchangeSearchForm } from "./form";
// import { ExchangeUploadButton } from "../../../components/buttons";
import { emptyPrice } from "../../../components/inputs/empty-price";

export const Exchange: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
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
  } = useCollection<IRecipe, IExchangeSearchDto>({
    baseUrl: "/exchange-rules",
    empty: {
      item: emptyPrice,
      ingredients: emptyPrice,
    },
    search: {
      query: "",
      exchangeStatus: [ExchangeStatus.ACTIVE, ExchangeStatus.NEW],
    },
    filter: ({ item, ingredients }) => ({
      item,
      ingredients,
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "exchange-rules"]} />

      <PageHeader message="pages.exchange-rules.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="ExchangeCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <ExchangeSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((recipe, i) => (
            <ListItem key={i}>
              <ListItemText>{recipe.item.components[0].token!.template!.title}</ListItemText>
              <ListItemText style={{ display: "flex", justifyContent: "space-around" }}>
                {recipe.item.components[0].token!.template!.contract?.title}
              </ListItemText>
              <ListItemSecondaryAction>
                {/* <ExchangeUploadButton rule={recipe} /> */}
                <IconButton onClick={handleEdit(recipe)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(recipe)} disabled={recipe.exchangeStatus !== ExchangeStatus.NEW}>
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
        initialValues={{ ...selected, title: selected.item.components[0]?.token?.template?.title }}
      />

      <ExchangeEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
