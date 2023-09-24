import { FC, Fragment } from "react";
import { Grid } from "@mui/material";

import type { ISearchDto } from "@gemunion/types-collection";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { StyledPagination } from "@framework/styled";
import { IMerchant } from "@framework/types";

import { MerchantListItem } from "./item";
import { stringify } from "qs";

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
          {rows.map(merchant => (
            <Grid item lg={4} sm={6} xs={12} key={merchant.id} sx={{ display: "flex" }}>
              <MerchantListItem merchant={merchant} />
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
