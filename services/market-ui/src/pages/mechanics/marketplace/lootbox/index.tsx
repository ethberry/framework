import { FC } from "react";
import { Grid, Pagination } from "@mui/material";
import { stringify } from "qs";

import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { ILootbox, ILootboxSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { ITabPanelProps, MarketplaceTabs } from "../tabs";
import { LootboxItem } from "../../lootbox-list/item";

export const Lootbox: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== MarketplaceTabs.lootbox) {
    return null;
  }

  const { rows, count, search, isLoading, handleChangePage } = useCollection<ILootbox, ILootboxSearchDto>({
    baseUrl: "/lootboxes",
    redirect: (_baseUrl, search) => `/marketplace/${value}?${stringify(search)}`,
  });

  return (
    <Grid>
      <PageHeader message="pages.marketplace.lootbox.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(lootbox => (
            <Grid item lg={4} sm={6} xs={12} key={lootbox.id}>
              <LootboxItem lootbox={lootbox} />
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
    </Grid>
  );
};
