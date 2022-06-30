import { FC, Fragment } from "react";
import { Grid, Pagination } from "@mui/material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IUniContract } from "@framework/types";
import { ISearchDto } from "@gemunion/types-collection";
import { useCollection } from "@gemunion/react-hooks";

import { ContractItem } from "./item";

export const Erc721ContractList: FC = () => {
  const { rows, count, search, isLoading, handleChangePage } = useCollection<IUniContract, ISearchDto>({
    baseUrl: "/erc721-contracts",
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc721-contracts"]} />

      <PageHeader message="pages.erc721-contracts.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(collection => (
            <Grid item lg={4} sm={6} xs={12} key={collection.id}>
              <ContractItem contract={collection} />
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
