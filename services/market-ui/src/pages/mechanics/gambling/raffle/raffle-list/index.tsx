import { FC, Fragment } from "react";
import { Grid } from "@mui/material";

import type { ISearchDto } from "@gemunion/types-collection";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { useCollection } from "@gemunion/react-hooks";
import { StyledPagination } from "@framework/styled";
import type { IContract } from "@framework/types";

import { RaffleListItem } from "./item";

export const RaffleList: FC = () => {
  const { rows, count, search, isLoading, handleSearch, handleChangePage } = useCollection<IContract, ISearchDto>({
    baseUrl: "/raffle/contracts",
    search: {
      query: "",
    },
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "raffle"]} />

      <PageHeader message="pages.raffle-list.title" />

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(raffle => (
            <Grid item lg={4} sm={6} xs={12} key={raffle.id}>
              <RaffleListItem contract={raffle} />
            </Grid>
          ))}
        </Grid>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />
    </Fragment>
  );
};
