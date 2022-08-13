import { FC } from "react";
import { Grid, Pagination } from "@mui/material";
import { stringify } from "qs";

import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IMysterybox, IMysteryboxSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { ITabPanelProps, MarketplaceTabs } from "../tabs";
import { MysteryboxItem } from "../../mechanics/mysterybox/mysterybox-list/item";

export const Mysterybox: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== MarketplaceTabs.mysterybox) {
    return null;
  }

  const { rows, count, search, isLoading, handleChangePage } = useCollection<IMysterybox, IMysteryboxSearchDto>({
    baseUrl: "/mysteryboxes",
    redirect: (_baseUrl, search) => `/marketplace/${value}?${stringify(search)}`,
  });

  return (
    <Grid>
      <PageHeader message="pages.marketplace.mysterybox.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(mysterybox => (
            <Grid item lg={4} sm={6} xs={12} key={mysterybox.id}>
              <MysteryboxItem mysterybox={mysterybox} />
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
