import { FC, Fragment } from "react";
import { Grid, Pagination } from "@mui/material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { ISearchDto } from "@gemunion/types-collection";
import { IExchange } from "@framework/types";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { useCollection } from "@gemunion/react-hooks";

import { ExchangeItem } from "./item";

export const ExchangeList: FC = () => {
  const { rows, count, search, isLoading, handleSearch, handleChangePage } = useCollection<IExchange, ISearchDto>({
    baseUrl: "/exchange",
    search: {
      query: "",
    },
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "exchange"]} />

      <PageHeader message="pages.exchange.title" />

      <CommonSearchForm initialValues={search} onSubmit={handleSearch} />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(recipe => (
            <Grid item lg={4} sm={6} xs={12} key={recipe.id}>
              <ExchangeItem exchange={recipe} />
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
