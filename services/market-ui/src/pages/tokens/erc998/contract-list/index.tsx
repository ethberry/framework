import { FC, Fragment } from "react";
import { Grid, Pagination } from "@mui/material";

import type { ISearchDto } from "@gemunion/types-collection";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IContract } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { Erc998ContractListItem } from "./item";

export const Erc998ContractList: FC = () => {
  const { rows, count, search, isLoading, handleChangePage } = useCollection<IContract, ISearchDto>({
    baseUrl: "/erc998-contracts",
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc998.contracts"]} />

      <PageHeader message="pages.erc998.contracts.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(contract => (
            <Grid item lg={4} sm={6} xs={12} key={contract.id}>
              <Erc998ContractListItem contract={contract} />
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
