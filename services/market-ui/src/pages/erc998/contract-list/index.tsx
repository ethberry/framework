import { FC, Fragment } from "react";
import { Grid, Pagination } from "@mui/material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IContract } from "@framework/types";
import { ISearchDto } from "@gemunion/types-collection";
import { useCollection } from "@gemunion/react-hooks";

import { ContractItem } from "./item";

export const Erc998ContractList: FC = () => {
  const { rows, count, search, isLoading, handleChangePage } = useCollection<IContract, ISearchDto>({
    baseUrl: "/erc998-contracts",
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc998-contract-list"]} />

      <PageHeader message="pages.erc998-contract-list.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(contract => (
            <Grid item lg={4} sm={6} xs={12} key={contract.id}>
              <ContractItem contract={contract} />
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
