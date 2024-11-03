import { FC } from "react";
import { Grid } from "@mui/material";

import type { ISearchDto } from "@ethberry/types-collection";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { useCollection } from "@ethberry/provider-collection";
import { StyledEmptyWrapper, StyledPagination } from "@framework/styled";
import type { IContract } from "@framework/types";

import { Erc721ContractListItem } from "./item";
import { StyledGrid } from "./styled";

export const Erc721ContractList: FC = () => {
  const { rows, count, search, isLoading, handleChangePage } = useCollection<IContract, ISearchDto>({
    baseUrl: "/erc721/contracts",
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc721", "erc721.contracts"]} />

      <PageHeader message="pages.erc721.contracts.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(contract => (
              <StyledGrid item lg={4} sm={6} xs={12} key={contract.id}>
                <Erc721ContractListItem contract={contract} />
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
    </Grid>
  );
};
