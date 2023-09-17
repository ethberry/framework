import { FC, Fragment } from "react";
import { Button, Grid, Pagination } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import type { ISearchDto } from "@gemunion/types-collection";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { useCollection } from "@gemunion/react-hooks";
import type { IContract } from "@framework/types";

import { MysteryContractListItem } from "./item";

export const MysteryContractList: FC = () => {
  const { rows, count, search, isLoading, isFiltersOpen, handleChangePage, handleSearch, handleToggleFilters } =
    useCollection<IContract, ISearchDto>({
      baseUrl: "/mystery/contracts",
    });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "mystery", "mystery.contracts"]} />

      <PageHeader message="pages.mystery.contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <CommonSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        testId="WaitListListSearchForm"
      >
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput name="merchantId" controller="merchants" disableClear />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(contract => (
            <Grid item lg={4} sm={6} xs={12} key={contract.id} sx={{ display: "flex" }}>
              <MysteryContractListItem contract={contract} />
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
