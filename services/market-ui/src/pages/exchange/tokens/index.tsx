import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid } from "@mui/material";
import { FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/provider-collection";
import { StyledEmptyWrapper, StyledPagination } from "@framework/styled";
import { ModuleType, TokenType } from "@framework/types";
import type { IToken, ITokenSearchDto } from "@framework/types";

import { TokenSearchForm } from "../../../components/forms/token-search";
import { MyTokenListItem } from "./item";

export interface IMyTokenListProps {
  embedded?: boolean;
}

export const MyTokensList: FC<IMyTokenListProps> = props => {
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
    baseUrl: "/tokens/search",
    embedded,
    redirect: () => "/tokens",
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "tokens"]} isHidden={embedded} />

      <PageHeader message="pages.tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <TokenSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractType={[TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155]}
        contractModule={[
          ModuleType.HIERARCHY,
          ModuleType.MYSTERY,
          ModuleType.COLLECTION,
          ModuleType.LOTTERY,
          ModuleType.RAFFLE,
          ModuleType.WRAPPER,
        ]}
        onRefreshPage={handleRefreshPage}
      />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(token => (
              <Grid item lg={4} sm={6} xs={12} key={token.id}>
                <MyTokenListItem token={token} />
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
