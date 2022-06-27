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
import { ExchangeStatus, IErc721Recipe, IErc721RecipeSearchDto } from "@framework/types";

import { Erc721RecipeEditDialog } from "./edit";
import { Erc721RecipeSearchForm } from "./form";
import { Erc721RecipeUploadButton } from "../../../components/buttons";

export const Erc721Recipes: FC = () => {
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
  } = useCollection<IErc721Recipe, IErc721RecipeSearchDto>({
    baseUrl: "/erc721-recipes",
    empty: {
      ingredients: [],
    },
    search: {
      query: "",
      recipeStatus: [ExchangeStatus.ACTIVE, ExchangeStatus.NEW],
    },
    filter: ({ erc721TemplateId, erc721DropboxId, ingredients }) => ({
      erc721TemplateId,
      erc721DropboxId,
      ingredients,
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc721-recipes"]} />

      <PageHeader message="pages.erc721-recipes.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="Erc721RecipeCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <Erc721RecipeSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((recipe, i) => (
            <ListItem key={i}>
              <ListItemText>
                {recipe.erc721Template ? recipe.erc721Template.title : recipe.erc721Dropbox!.title}
              </ListItemText>
              <ListItemSecondaryAction>
                <Erc721RecipeUploadButton recipe={recipe} />
                <IconButton onClick={handleEdit(recipe)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(recipe)} disabled={recipe.recipeStatus !== ExchangeStatus.NEW}>
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
        initialValues={{ ...selected, title: selected.erc721Template?.title }}
      />

      <Erc721RecipeEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
