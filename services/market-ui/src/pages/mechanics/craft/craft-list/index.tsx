import { FC, Fragment } from "react";
import { Grid, Pagination } from "@mui/material";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { SwitchInput } from "@gemunion/mui-inputs-core";
import { useCollection } from "@gemunion/react-hooks";
import { ICraft, ICraftSearchDto } from "@framework/types";

import { CraftItem } from "./item";

export const CraftList: FC = () => {
  const { rows, count, search, isLoading, handleSearch, handleChangePage, isFiltersOpen } = useCollection<
    ICraft,
    ICraftSearchDto
  >({
    baseUrl: "/craft",
    search: {
      query: "",
      inverse: false,
    },
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "craft-list"]} />

      <PageHeader message="pages.craft-list.title" />

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SwitchInput name="inverse" />
          </Grid>
        </Grid>
      </CommonSearchForm>

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
