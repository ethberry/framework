import { FC, Fragment } from "react";
import { Grid, Pagination } from "@mui/material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { ISearchDto } from "@gemunion/types-collection";
import { IErc998Recipe } from "@framework/types";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { useCollection } from "@gemunion/react-hooks";

import { Erc998RecipeItem } from "./item";

export const Erc998RecipeList: FC = () => {
  const { rows, count, search, isLoading, handleSearch, handleChangePage } = useCollection<IErc998Recipe, ISearchDto>({
    baseUrl: "/erc998-recipes",
    search: {
      query: "",
    },
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc998-recipes"]} />

      <PageHeader message="pages.erc998-recipes.title" />

      <CommonSearchForm initialValues={search} onSubmit={handleSearch} />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(recipe => (
            <Grid item lg={4} sm={6} xs={12} key={recipe.id}>
              <Erc998RecipeItem recipe={recipe} />
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
