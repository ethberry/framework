import { FC, Fragment } from "react";
import { Grid, Pagination } from "@mui/material";

import type { ISearchDto } from "@gemunion/types-collection";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IContract } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";
import { RaffleListItem } from "./item";

export const RaffleList: FC = () => {
  const {
    rows,
    count,
    search,
    isLoading,
    // selected,
    // isFiltersOpen,
    // handleToggleFilters,
    // isViewDialogOpen,
    // handleView,
    // handleViewConfirm,
    // handleViewCancel,
    // handleSearch,
    handleChangePage,
  } = useCollection<IContract, ISearchDto>({
    baseUrl: "/raffle/contracts",
    search: {
      query: "",
    },
  });
  // TODO add search filters
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "raffle", "raffle-list"]} />

      <PageHeader message="pages.raffle-list.title" />

      {/* <CommonSearchForm initialValues={search} onSubmit={handleSearch} /> */}

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(raffle => (
            <Grid item lg={4} sm={6} xs={12} key={raffle.id}>
              <RaffleListItem contract={raffle} />
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
