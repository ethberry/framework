import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, Pagination } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { stringify } from "qs";

import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IErc721AssetSearchDto, IErc721Token } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { Erc721Token } from "../../erc721/token-list/item";
import { AssetsTabs, ITabPanelProps } from "../tabs";
import { Erc721TokenSearchForm } from "../../erc721/token-list/form";

export const Items: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== AssetsTabs.items) {
    return null;
  }

  const { rows, count, search, isLoading, isFiltersOpen, handleToggleFilters, handleSubmit, handleChangePage } =
    useCollection<IErc721Token, IErc721AssetSearchDto>({
      baseUrl: "/erc721-tokens",
      search: {
        erc721CollectionIds: [3],
        rarity: [],
      },
      redirect: (_baseUrl, search) => `/assets/${value}?${stringify(search)}`,
    });

  return (
    <Grid>
      <PageHeader message="pages.assets.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <Erc721TokenSearchForm onSubmit={handleSubmit} initialValues={search} open={isFiltersOpen} />

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
    </Grid>
  );
};
