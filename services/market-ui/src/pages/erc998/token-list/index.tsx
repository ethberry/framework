import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, Pagination } from "@mui/material";
import { FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IErc998AssetSearchDto, IErc998Token } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { Erc998Token } from "./item";
import { Erc998TokenSearchForm } from "./form";

export interface IErc998TokenListProps {
  embedded?: boolean;
}

export const Erc998TokenList: FC<IErc998TokenListProps> = props => {
  const { embedded } = props;

  const { rows, count, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch, handleChangePage } =
    useCollection<IErc998Token, IErc998AssetSearchDto>({
      baseUrl: "/erc998-tokens",
      embedded,
      search: {
        erc998CollectionIds: [],
        rarity: [],
      },
    });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc998-tokens"]} isHidden={embedded} />

      <PageHeader message="pages.erc998-tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <Erc998TokenSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} embedded={embedded} />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(token => (
            <Grid item lg={4} sm={6} xs={12} key={token.id}>
              <Erc998Token token={token} />
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
