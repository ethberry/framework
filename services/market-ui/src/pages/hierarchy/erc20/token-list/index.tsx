import { FC, Fragment } from "react";
import { Grid } from "@mui/material";

import { StyledEmptyWrapper, StyledPagination } from "@framework/styled";
import type { IToken, ITokenSearchDto } from "@framework/types";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/provider-collection";

import { Erc20CoinsListItem } from "./item";

export interface IErc20CoinsListProps {
  embedded?: boolean;
}

export const Erc20CoinsList: FC<IErc20CoinsListProps> = props => {
  const { embedded } = props;

  const { rows, count, search, isLoading, handleSearch, handleChangePage } = useCollection<IToken, ITokenSearchDto>({
    baseUrl: "/erc20/coins",
    search: {
      query: "",
    },
    embedded,
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc20.coins"]} isHidden={embedded} />

      <PageHeader message="pages.erc20.coins.title" />

      <CommonSearchForm initialValues={search} onSubmit={handleSearch} testId="CoinsSearchForm" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(token => (
              <Grid item lg={4} sm={6} xs={12} key={token.id}>
                <Erc20CoinsListItem token={token} />
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
    </Fragment>
  );
};
