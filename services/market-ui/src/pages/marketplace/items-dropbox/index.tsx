import { FC } from "react";
import { Grid, Pagination } from "@mui/material";
import { stringify } from "qs";

import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IErc721Dropbox, IErc721DropboxSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { ITabPanelProps, MarketplaceTabs } from "../tabs";
import { DropboxItem } from "../../erc721/dropbox-list/item";

export const ItemsDropbox: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== MarketplaceTabs.itemsdb) {
    return null;
  }

  const { rows, count, search, isLoading, handleChangePage } = useCollection<IErc721Dropbox, IErc721DropboxSearchDto>({
    baseUrl: "/erc721-dropboxes",
    search: {
      erc721CollectionIds: [2], // Erc721Dropbox Collection
      erc721TemplateCollectionIds: [3], // Erc721Items Collection
    },
    redirect: (_baseUrl, search) => `/marketplace/${value}?${stringify(search)}`,
  });

  return (
    <Grid>
      <PageHeader message="pages.marketplace.itemsdb.title" />

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
