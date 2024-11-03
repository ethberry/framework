import { FC } from "react";
import { Grid } from "@mui/material";

import { StyledEmptyWrapper } from "@framework/styled";
import { IAssetPromo } from "@framework/types";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { useCollection } from "@ethberry/provider-collection";

import { AssetPromoItem } from "./item";

export const AssetPromoList: FC = () => {
  const { rows, isLoading } = useCollection<IAssetPromo>({
    baseUrl: "/promos",
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "promo-list"]} />

      <PageHeader message="pages.promo-list.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(promo => (
              <Grid item lg={4} sm={6} xs={12} key={promo.id}>
                <AssetPromoItem promo={promo} />
              </Grid>
            ))}
          </StyledEmptyWrapper>
        </Grid>
      </ProgressOverlay>
    </Grid>
  );
};
