import { FC, Fragment } from "react";
import { Grid } from "@mui/material";
import { useParams } from "react-router";
import { stringify } from "qs";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { StyledPagination } from "@framework/styled";
import { IContract, IContractSearchDto } from "@framework/types";

import { ContractListItem } from "./item";
import { StyledGrid } from "./styled";

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
            <StyledGrid item lg={4} sm={6} xs={12} key={contract.id}>
              <ContractListItem contract={contract} />
            </StyledGrid>
          ))}
        </Grid>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />
    </Fragment>
  );
};
