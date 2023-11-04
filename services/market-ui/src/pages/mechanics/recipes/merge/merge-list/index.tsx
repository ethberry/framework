import { FC, Fragment } from "react";
import { Button, Grid } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { StyledPagination } from "@framework/styled";
import type { IMerge, IMergeSearchDto } from "@framework/types";
import { ModuleType } from "@framework/types";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { useCollection } from "@gemunion/react-hooks";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TokenType } from "@gemunion/types-blockchain";

import { MergeItem } from "./item";

export const MergeList: FC = () => {
  const { rows, count, search, isLoading, isFiltersOpen, handleSearch, handleChangePage, handleToggleFilters } =
    useCollection<IMerge, IMergeSearchDto>({
      baseUrl: "/recipes/merge",
      search: {
        query: "",
        contractId: void 0,
      },
    });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "recipes", "recipes.merge-list"]} />

      <PageHeader message="pages.recipes.merge-list.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} testId="MergeSearchForm">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <EntityInput
              name="contractId"
              controller="contracts"
              data={{
                contractModule: [ModuleType.HIERARCHY],
                contractType: [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155],
              }}
            />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(recipe => (
            <Grid item lg={4} sm={6} xs={12} key={recipe.id}>
              <MergeItem merge={recipe} />
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