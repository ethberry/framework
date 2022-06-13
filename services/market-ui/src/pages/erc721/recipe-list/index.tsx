import { FC, Fragment } from "react";
import { Grid, Pagination } from "@mui/material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { ISearchDto } from "@gemunion/types-collection";
import { IErc721Recipe } from "@framework/types";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { useCollection } from "@gemunion/react-hooks";

import { Erc721RecipeItem } from "./item";

export const Erc721RecipeList: FC = () => {
  const { rows, count, search, isLoading, handleSearch, handleChangePage } = useCollection<IErc721Recipe, ISearchDto>({
    baseUrl: "/erc721-recipes",
    search: {
      query: "",
    },
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc721-recipes"]} />

      <PageHeader message="pages.erc721-recipes.title" />

      <CommonSearchForm initialValues={search} onSubmit={handleSearch} />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(recipe => (
            <Grid item lg={4} sm={6} xs={12} key={recipe.id}>
              <Erc721RecipeItem recipe={recipe} />
            </Grid>
          ))}
        </Grid>
      </ProgressOverlay>

      <Pagination
        sx={{ mt: 2 }}
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />
    </Fragment>
  );
};
