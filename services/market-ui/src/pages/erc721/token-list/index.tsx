import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, Pagination } from "@mui/material";
import { FilterList } from "@mui/icons-material";

import { ProgressOverlay } from "@gemunion/mui-progress";
import { PageHeader } from "@gemunion/mui-page-header";
import { IErc721AssetSearchDto, IErc721Token } from "@framework/types";
import { Breadcrumbs } from "@gemunion/mui-breadcrumbs";
import { useCollection } from "@gemunion/react-hooks";

import { Erc721Token } from "./item";
import { Erc721TokenSearchForm } from "./form";

export interface IErc721TokenListProps {
  embedded?: boolean;
}

export const Erc721TokenList: FC<IErc721TokenListProps> = props => {
  const { embedded } = props;

  const { rows, count, search, isLoading, isFiltersOpen, handleToggleFilters, handleSubmit, handleChangePage } =
    useCollection<IErc721Token, IErc721AssetSearchDto>({
      baseUrl: "/erc721-tokens",
      embedded,
      search: {
        erc721CollectionIds: [],
        rarity: [],
      },
    });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc721-tokens"]} isHidden={embedded} />

      <PageHeader message="pages.erc721-tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <Erc721TokenSearchForm onSubmit={handleSubmit} initialValues={search} open={isFiltersOpen} embedded={embedded} />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(token => (
            <Grid item lg={4} sm={6} xs={12} key={token.id}>
              <Erc721Token token={token} />
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
