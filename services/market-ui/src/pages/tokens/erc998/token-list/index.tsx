import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, Pagination } from "@mui/material";
import { FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IToken, ITokenSearchDto, ModuleType, TokenAttributes, TokenType } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { Erc998TokenListItem } from "./item";
import { TokenSearchForm } from "../../../../components/forms/token-search";

export interface IErc998TokenListProps {
  embedded?: boolean;
}

export const Erc998TokenList: FC<IErc998TokenListProps> = props => {
  const { embedded } = props;

  const { rows, count, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch, handleChangePage } =
    useCollection<IToken, ITokenSearchDto>({
      baseUrl: "/erc998-tokens",
      embedded,
      search: {
        contractIds: [],
        attributes: {
          [TokenAttributes.RARITY]: [],
          [TokenAttributes.GRADE]: [],
        },
      },
    });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc998.tokens"]} isHidden={embedded} />

      <PageHeader message="pages.erc998.tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <TokenSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractType={[TokenType.ERC721]}
        contractModule={[ModuleType.HIERARCHY]}
      />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(token => (
            <Grid item lg={4} sm={6} xs={12} key={token.id}>
              <Erc998TokenListItem token={token} />
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
