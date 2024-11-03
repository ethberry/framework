import React from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { useCollection } from "@ethberry/provider-collection";
import { IVestingBox, IVestingBoxSearchDto } from "@framework/types";
import { StyledEmptyWrapper, StyledPagination } from "@framework/styled";

import { BoxCard } from "./box-card";

export const VestingBoxList = () => {
  const { rows, count, search, isLoading, handleChangePage } = useCollection<IVestingBox, IVestingBoxSearchDto>({
    baseUrl: "/vesting/boxes",
    empty: {},
    search: {},
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "vesting"]} />

      <PageHeader message="pages.vesting.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(vestingBox => (
              <Grid item lg={4} md={6} sm={12} xs={12} key={vestingBox.id}>
                <BoxCard {...vestingBox} />
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
