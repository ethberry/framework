import { FC } from "react";
import { Grid } from "@mui/material";
import { stringify } from "qs";

import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { StyledPagination } from "@framework/styled";
import { IMysteryBox, IMysteryBoxSearchDto } from "@framework/types";

import { MysteryBoxListItem } from "../../../mechanics/mystery/box-list/item";
import { ITabPanelProps, MarketplaceTabs } from "../tabs";

export const Mystery: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== MarketplaceTabs.mysterybox) {
    return null;
  }

  const { rows, count, search, isLoading, handleChangePage } = useCollection<IMysteryBox, IMysteryBoxSearchDto>({
    baseUrl: "/mystery/boxes",
    redirect: (_baseUrl, search) => `/marketplace/${value}?${stringify(search)}`,
  });

  return (
    <Grid>
      <PageHeader message="pages.marketplace.mysterybox.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(mysterybox => (
            <Grid item lg={4} sm={6} xs={12} key={mysterybox.id}>
              <MysteryBoxListItem mysteryBox={mysterybox} />
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
    </Grid>
  );
};
