import { FC, Fragment } from "react";
import { Grid, Pagination } from "@mui/material";

import type { ISearchDto } from "@gemunion/types-collection";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IContract } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { MysteryboxContractListItem } from "./item";

export const MysteryboxContractList: FC = () => {
  const { rows, count, search, isLoading, handleChangePage } = useCollection<IContract, ISearchDto>({
    baseUrl: "/mysterybox-contracts",
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "mysterybox.contracts"]} />

      <PageHeader message="pages.mysterybox.contracts.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(contract => (
            <Grid item lg={4} sm={6} xs={12} key={contract.id}>
              <MysteryboxContractListItem contract={contract} />
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
