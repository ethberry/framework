import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid } from "@mui/material";
import { FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/provider-collection";
import { StyledEmptyWrapper, StyledPagination } from "@framework/styled";
import { ModuleType, TokenType } from "@framework/types";
import type { IToken, ITokenSearchDto } from "@framework/types";

import { TokenSearchForm } from "../../../../components/forms/token-search";
import { Erc998TokenListItem } from "./item";

export interface IErc998TokenListProps {
  embedded?: boolean;
}

export const Erc998TokenList: FC<IErc998TokenListProps> = props => {
  const { embedded } = props;

  const {
    rows,
    count,
    search,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    handleSearch,
    handleChangePage,
    handleRefreshPage,
  } = useCollection<IToken, ITokenSearchDto>({
    baseUrl: "/erc998/tokens",
    embedded,
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc998", "erc998.tokens"]} isHidden={embedded} />

      <PageHeader message="pages.erc998.tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <TokenSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractType={[TokenType.ERC998]}
        contractModule={[ModuleType.HIERARCHY]}
        onRefreshPage={handleRefreshPage}
      />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(token => (
              <Grid item lg={4} sm={6} xs={12} key={token.id}>
                <Erc998TokenListItem token={token} />
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
    </Fragment>
  );
};
