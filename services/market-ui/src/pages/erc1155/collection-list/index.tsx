import { FC, Fragment } from "react";
import { Grid, Pagination } from "@mui/material";

import { ProgressOverlay } from "@gemunion/mui-progress";
import { PageHeader } from "@gemunion/mui-page-header";
import { IErc1155Collection } from "@framework/types";
import { ISearchDto } from "@gemunion/types-collection";
import { Breadcrumbs } from "@gemunion/mui-breadcrumbs";
import { useCollection } from "@gemunion/react-hooks";

import { Erc1155CollectionItem } from "./item";

export const Erc1155CollectionList: FC = () => {
  const { rows, count, search, isLoading, handleChangePage } = useCollection<IErc1155Collection, ISearchDto>({
    baseUrl: "/erc1155-collections",
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc1155-collections"]} />

      <PageHeader message="pages.erc1155-collections.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(collection => (
            <Grid item lg={4} sm={6} xs={12} key={collection.id}>
              <Erc1155CollectionItem collection={collection} />
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
