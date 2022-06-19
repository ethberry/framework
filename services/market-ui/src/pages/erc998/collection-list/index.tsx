import { FC, Fragment } from "react";
import { Grid, Pagination } from "@mui/material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IErc998Collection } from "@framework/types";
import { ISearchDto } from "@gemunion/types-collection";
import { useCollection } from "@gemunion/react-hooks";

import { CollectionItem } from "./item";

export const Erc998CollectionList: FC = () => {
  const { rows, count, search, isLoading, handleChangePage } = useCollection<IErc998Collection, ISearchDto>({
    baseUrl: "/erc998-collections",
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc998-collections"]} />

      <PageHeader message="pages.erc998-collections.title" />

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
