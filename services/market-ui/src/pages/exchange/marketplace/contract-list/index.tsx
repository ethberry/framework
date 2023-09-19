import { FC, Fragment } from "react";
import { Grid, Pagination } from "@mui/material";
import { useParams } from "react-router";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IContract, IContractSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { ContractListItem } from "./item";
import { stringify } from "qs";

export interface IContractListProps {
  embedded?: boolean;
}

export const ContractList: FC<IContractListProps> = props => {
  const { embedded } = props;

  const { id } = useParams<{ id: string }>();

  const { rows, count, search, isLoading, handleChangePage } = useCollection<IContract, IContractSearchDto>({
    baseUrl: "/contracts",
    embedded,
    search: {
      query: "",
      merchantId: embedded ? ~~id! : void 0,
    },
    redirect: (_baseUrl, search) => `/marketplace/contracts?${stringify(search)}`,
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "marketplace", "marketplace.contracts"]} isHidden={embedded} />

      <PageHeader message="pages.marketplace.contracts.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(contract => (
            <Grid item lg={4} sm={6} xs={12} key={contract.id} sx={{ display: "flex" }}>
              <ContractListItem contract={contract} />
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
