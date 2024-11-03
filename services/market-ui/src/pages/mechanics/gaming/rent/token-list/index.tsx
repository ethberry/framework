import { FC } from "react";
import { Button, Grid } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { stringify } from "qs";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { useCollection } from "@ethberry/provider-collection";
import { StyledEmptyWrapper, StyledPagination } from "@framework/styled";
import { ContractFeatures, IToken, ITokenSearchDto, ModuleType, TokenType } from "@framework/types";

import { TokenSearchForm } from "../../../../../components/forms/token-search";
import { RentTokenListItem } from "./item";

export const Rent: FC = () => {
  const { rows, count, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch, handleChangePage } =
    useCollection<IToken, ITokenSearchDto>({
      baseUrl: "/rent/tokens",
      search: {},
      redirect: (_, search) => `/rent?${stringify(search)}`,
    });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "rent"]} />

      <PageHeader message="pages.rent.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <TokenSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractType={[TokenType.ERC721, TokenType.ERC998]}
        contractModule={[ModuleType.HIERARCHY]}
        contractFeatures={[ContractFeatures.RENTABLE]}
      />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(token => (
              <Grid item lg={4} sm={6} xs={12} key={token.id}>
                <RentTokenListItem token={token} />
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
