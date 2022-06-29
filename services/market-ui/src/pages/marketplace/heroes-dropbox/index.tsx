import { FC } from "react";
import { Grid, Pagination } from "@mui/material";
import { stringify } from "qs";

import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IDropbox, IDropboxSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { ITabPanelProps, MarketplaceTabs } from "../tabs";
import { DropboxItem } from "../../mechanics/dropbox-list/item";

export const HeroesDropbox: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== MarketplaceTabs.heroesdb) {
    return null;
  }

  const { rows, count, search, isLoading, handleChangePage } = useCollection<IDropbox, IDropboxSearchDto>({
    baseUrl: "/erc721-dropboxes",
    search: {
      uniContractIds: [2], // Erc721Dropbox Collection
      uniTemplateContractIds: [4], // Erc721Hero Collection
    },
    redirect: (_baseUrl, search) => `/marketplace/${value}?${stringify(search)}`,
  });

  return (
    <Grid>
      <PageHeader message="pages.marketplace.heroesdb.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(dropbox => (
            <Grid item lg={4} sm={6} xs={12} key={dropbox.id}>
              <DropboxItem dropbox={dropbox} />
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
