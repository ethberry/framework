import { FC, Fragment } from "react";
import { Grid } from "@mui/material";
import { stringify } from "qs";

import type { ISearchDto } from "@ethberry/types-collection";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { useCollection } from "@ethberry/provider-collection";
import { StyledEmptyWrapper, StyledPagination } from "@framework/styled";
import type { IMerchant } from "@framework/types";

import { MerchantListItem } from "./item";
import { StyledGrid } from "./styled";

export const MerchantList: FC = () => {
  const { rows, count, search, isLoading, handleChangePage } = useCollection<IMerchant, ISearchDto>({
    baseUrl: "/merchants",
    redirect: (_baseUrl, search) => `/marketplace/merchants?${stringify(search)}`,
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "marketplace", "marketplace.merchants"]} />

      <PageHeader message="pages.marketplace.merchants.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(merchant => (
              <StyledGrid item lg={4} sm={6} xs={12} key={merchant.id}>
                <MerchantListItem merchant={merchant} />
              </StyledGrid>
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
