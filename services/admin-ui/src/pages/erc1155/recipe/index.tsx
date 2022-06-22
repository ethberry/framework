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
import { Erc1155RecipeStatus, IErc1155Recipe, IErc1155RecipeSearchDto } from "@framework/types";

import { Erc1155RecipeEditDialog } from "./edit";
import { Erc1155RecipeSearchForm } from "./form";
import { Erc1155RecipeUploadButton } from "../../../components/buttons";

export const Erc1155Recipes: FC = () => {
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
  } = useCollection<IErc1155Recipe, IErc1155RecipeSearchDto>({
    baseUrl: "/erc1155-recipes",
    empty: {
      ingredients: [],
    },
    search: {
      query: "",
      recipeStatus: [Erc1155RecipeStatus.ACTIVE, Erc1155RecipeStatus.NEW],
    },
    filter: ({ erc1155TokenId, ingredients }) => ({
      erc1155TokenId,
      ingredients,
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc1155-recipes"]} />

      <PageHeader message="pages.erc1155-recipes.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="Erc1155RecipeCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <Erc1155RecipeSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((recipe, i) => (
            <ListItem key={i}>
              <ListItemText>{recipe.erc1155Token!.title}</ListItemText>
              <ListItemSecondaryAction>
                <Erc1155RecipeUploadButton recipe={recipe} />
                <IconButton onClick={handleEdit(recipe)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(recipe)} disabled={recipe.recipeStatus !== Erc1155RecipeStatus.NEW}>
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
        initialValues={{ ...selected, title: selected.erc1155Token?.title }}
      />

      <Erc1155RecipeEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
