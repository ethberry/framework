import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, Pagination } from "@mui/material";
import { FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IToken, ITokenSearchDto, ModuleType, TokenAttributes, TokenType } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { Erc1155Token } from "./item";
import { TokenSearchForm } from "../../../../components/forms/token-search";

export interface ITokenListProps {
  embedded?: boolean;
}

export const Erc1155TokenList: FC<ITokenListProps> = props => {
  const { embedded } = props;

  const { rows, count, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch, handleChangePage } =
    useCollection<IToken, ITokenSearchDto>({
      baseUrl: "/erc1155-tokens",
      embedded,
      search: {
        contractIds: [],
        attributes: {
          [TokenAttributes.RARITY]: [],
        },
      },
    });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc1155-tokens"]} isHidden={embedded} />

      <PageHeader message="pages.erc1155-token.title">
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
        contractModule={[ModuleType.CORE]}
      />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(token => (
            <Grid item lg={4} sm={6} xs={12} key={token.id}>
              <Erc1155Token token={token} />
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
