import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, Pagination } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { constants } from "ethers";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IErc1155Token, IErc1155TokenSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { Erc1155Token } from "./item";
import { Erc1155TokenSearchForm } from "./form";
import { useParams } from "react-router";

export interface IErc1155TokenListProps {
  embedded?: boolean;
}

export const Erc1155TokenList: FC<IErc1155TokenListProps> = props => {
  const { embedded } = props;
  const { id } = useParams<{ id: string }>();

  const { rows, count, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch, handleChangePage } =
    useCollection<IErc1155Token, IErc1155TokenSearchDto>({
      baseUrl: "/erc1155-tokens",
      embedded,
      search: {
        query: "",
        erc1155CollectionIds: [~~id!],
        minPrice: constants.Zero.toString(),
        maxPrice: constants.WeiPerEther.toString(),
      },
    });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "marketplace"]} isHidden={embedded} />

      <PageHeader message="pages.erc1155-tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <Erc1155TokenSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} embedded={embedded} />

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
