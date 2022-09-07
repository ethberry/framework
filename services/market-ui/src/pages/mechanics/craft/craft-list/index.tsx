import { FC, Fragment } from "react";
import { Grid, Pagination } from "@mui/material";

import type { ISearchDto } from "@gemunion/types-collection";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { ICraft } from "@framework/types";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { useCollection } from "@gemunion/react-hooks";

import { CraftItem } from "./item";

export const CraftList: FC = () => {
  const { rows, count, search, isLoading, handleSearch, handleChangePage } = useCollection<ICraft, ISearchDto>({
    baseUrl: "/craft",
    search: {
      query: "",
    },
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "craft-list"]} />

      <PageHeader message="pages.craft-list.title" />

      <CommonSearchForm initialValues={search} onSubmit={handleSearch} />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(recipe => (
            <Grid item lg={4} sm={6} xs={12} key={recipe.id}>
              <CraftItem craft={recipe} />
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
