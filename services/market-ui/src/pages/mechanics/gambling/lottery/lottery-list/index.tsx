import { FC } from "react";
import { Grid } from "@mui/material";

import type { ISearchDto } from "@ethberry/types-collection";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { CommonSearchForm } from "@ethberry/mui-form-search";
import { useCollection } from "@ethberry/provider-collection";
import { StyledEmptyWrapper, StyledPagination } from "@framework/styled";
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
    <Grid>
      <Breadcrumbs path={["dashboard", "lottery"]} />

      <PageHeader message="pages.lottery-list.title" />

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(lottery => (
              <Grid item lg={4} sm={6} xs={12} key={lottery.id}>
                <LotteryListItem contract={lottery} />
              </Grid>
            ))}
          </StyledEmptyWrapper>
        </Grid>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />
    </Grid>
  );
};
