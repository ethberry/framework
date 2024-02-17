import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid } from "@mui/material";
import { FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { StyledPagination } from "@framework/styled";
import { IToken, ITokenSearchDto, ModuleType, TokenType } from "@framework/types";

import { TokenSearchForm } from "../../../../components/forms/token-search";
import { Erc20TokenListItem } from "./item";

export interface IErc20TokenListProps {
  embedded?: boolean;
}

export const Erc20TokenList: FC<IErc20TokenListProps> = props => {
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
    baseUrl: "/erc20/tokens",
    embedded,
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc20.tokens"]} isHidden={embedded} />

      <PageHeader message="pages.erc20.tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <TokenSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractType={[TokenType.ERC20]}
        contractModule={[ModuleType.HIERARCHY]}
        onRefreshPage={handleRefreshPage}
      />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(token => (
            <Grid item lg={4} sm={6} xs={12} key={token.id}>
              <Erc20TokenListItem token={token} />
            </Grid>
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
