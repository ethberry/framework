import { FC, Fragment } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IAssetPromo } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { AssetPromoItem } from "./item";

export const AssetPromoList: FC = () => {
  const { rows, isLoading } = useCollection<IAssetPromo>({
    baseUrl: "/promos",
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "promo-list"]} />

      <PageHeader message="pages.promo-list.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(promo => (
            <Grid item lg={4} sm={6} xs={12} key={promo.id}>
              <AssetPromoItem promo={promo} />
            </Grid>
          ))}
        </Grid>
      </ProgressOverlay>
    </Fragment>
  );
};
