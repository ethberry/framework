import { FC, Fragment } from "react";
import { Button, Grid } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import type { ISearchDto } from "@gemunion/types-collection";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { useCollection } from "@gemunion/react-hooks";
import { StyledEmptyWrapper, StyledPagination } from "@framework/styled";
import type { IContract } from "@framework/types";

import { FormRefresher } from "../../../../../components/forms/form-refresher";
import { MysteryContractListItem } from "./item";
import { StyledGrid } from "./styled";

export const MysteryContractList: FC = () => {
  const {
    rows,
    count,
    search,
    isLoading,
    isFiltersOpen,
    handleChangePage,
    handleRefreshPage,
    handleSearch,
    handleToggleFilters,
  } = useCollection<IContract, ISearchDto>({
    baseUrl: "/mystery/contracts",
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "mystery", "mystery.contracts"]} />

      <PageHeader message="pages.mystery.contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <CommonSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        testId="WaitListListSearchForm"
      >
        <FormRefresher onRefreshPage={handleRefreshPage} />
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput name="merchantId" controller="merchants" />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(contract => (
              <StyledGrid item lg={4} sm={6} xs={12} key={contract.id}>
                <MysteryContractListItem contract={contract} />
              </StyledGrid>
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
