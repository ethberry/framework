import { FC } from "react";
import { Button, Grid } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { useCollection } from "@ethberry/provider-collection";
import { StyledEmptyWrapper, StyledPagination } from "@framework/styled";
import type { IToken, ITokenSearchDto } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";

import { Erc1155TokenListItem } from "./item";
import { TokenSearchForm } from "../../../../components/forms/token-search";

export interface ITokenListProps {
  embedded?: boolean;
}

export const Erc1155TokenList: FC<ITokenListProps> = props => {
  const { embedded } = props;

  const { rows, count, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch, handleChangePage } =
    useCollection<IToken, ITokenSearchDto>({
      baseUrl: "/erc1155/tokens",
      embedded,
    });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc1155", "erc1155.tokens"]} isHidden={embedded} />

      <PageHeader message="pages.erc1155.tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <TokenSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractType={[TokenType.ERC1155]}
        contractModule={[ModuleType.HIERARCHY]}
      />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(token => (
              <Grid item lg={4} sm={6} xs={12} key={token.id}>
                <Erc1155TokenListItem token={token} />
              </Grid>
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
