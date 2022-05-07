import { FC, Fragment } from "react";
import { Grid, Pagination } from "@mui/material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IErc721Collection } from "@framework/types";
import { ISearchDto } from "@gemunion/types-collection";
import { useCollection } from "@gemunion/react-hooks";

import { CollectionItem } from "./item";

export const Erc721CollectionList: FC = () => {
  const { rows, count, search, isLoading, handleChangePage } = useCollection<IErc721Collection, ISearchDto>({
    baseUrl: "/erc721-collections",
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc721-collections"]} />

      <PageHeader message="pages.erc721-collections.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(collection => (
            <Grid item lg={4} sm={6} xs={12} key={collection.id}>
              <CollectionItem collection={collection} />
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
    </Fragment>
  );
};
