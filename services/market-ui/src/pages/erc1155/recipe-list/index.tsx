import { FC, Fragment } from "react";
import { Grid, Pagination } from "@mui/material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { ISearchDto } from "@gemunion/types-collection";
import { IErc1155Recipe } from "@framework/types";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { useCollection } from "@gemunion/react-hooks";

import { Erc1155RecipeItem } from "./item";

export const Erc1155RecipeList: FC = () => {
  const { rows, count, search, isLoading, handleSearch, handleChangePage } = useCollection<IErc1155Recipe, ISearchDto>({
    baseUrl: "/erc1155-recipes",
    search: {
      query: "",
    },
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc1155-recipes"]} />

      <PageHeader message="pages.erc1155-recipes.title" />

      <CommonSearchForm initialValues={search} onSearch={handleSearch} />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(recipe => (
            <Grid item lg={4} sm={6} xs={12} key={recipe.id}>
              <Erc1155RecipeItem recipe={recipe} />
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
