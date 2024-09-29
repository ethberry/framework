import { FC, Fragment } from "react";
import { Grid } from "@mui/material";

import type { ISearchDto } from "@ethberry/types-collection";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { useCollection } from "@ethberry/provider-collection";
import { StyledEmptyWrapper, StyledPagination } from "@framework/styled";
import type { IContract } from "@framework/types";

import { Erc1155ContractListItem } from "./item";
import { StyledGrid } from "./styled";

export const Erc1155ContractList: FC = () => {
  const { rows, count, search, isLoading, handleChangePage } = useCollection<IContract, ISearchDto>({
    baseUrl: "/erc1155/contracts",
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc1155", "erc1155.contracts"]} />

      <PageHeader message="pages.erc1155.contracts.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(contract => (
              <StyledGrid item lg={4} sm={6} xs={12} key={contract.id}>
                <Erc1155ContractListItem contract={contract} />
              </StyledGrid>
            ))}
          </StyledEmptyWrapper>
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
