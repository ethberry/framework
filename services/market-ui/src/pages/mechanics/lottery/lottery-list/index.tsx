import { FC, Fragment } from "react";
import { Grid, Pagination } from "@mui/material";

import type { ISearchDto } from "@gemunion/types-collection";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { useCollection } from "@gemunion/react-hooks";
import type { IContract } from "@framework/types";

import { LotteryListItem } from "./item";

export const LotteryList: FC = () => {
  const { rows, count, search, isLoading, handleSearch, handleChangePage } = useCollection<IContract, ISearchDto>({
    baseUrl: "/lottery/contracts",
    search: {
      query: "",
    },
  });
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "lottery"]} />

      <PageHeader message="pages.lottery-list.title" />

      <CommonSearchForm initialValues={search} onSubmit={handleSearch} />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(lottery => (
            <Grid item lg={4} sm={6} xs={12} key={lottery.id}>
              <LotteryListItem contract={lottery} />
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
