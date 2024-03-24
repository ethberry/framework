import { FC } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { Grid, Button } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";

import { StyledEmptyWrapper } from "@framework/styled";
import type { IReferralTree } from "@framework/types";
import { AddressLink } from "@gemunion/mui-scanner";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";

import type { IReferralTreeSearchDto } from "./form";
import { ReferralTreeSearchForm } from "./form";

export const ReferralTree: FC = () => {
  const {
    count,
    rows,
    search,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    handleSearch,
    handleRefreshPage,
    handleChangePaginationModel,
  } = useCollection<IReferralTree, IReferralTreeSearchDto>({
    baseUrl: "/referral/tree",
    search: {
      merchantIds: [], // search by all merchants
    },
  });

  const { formatMessage } = useIntl();

  // prettier-ignore
  // TODO make it nice
  const columns = [
    {
      field: "id",
      headerName: formatMessage({ id: "form.labels.id" }),
      sortable: true,
      flex: 0.05
    },
    {
      field: "wallet",
      headerName: formatMessage({ id: "form.labels.wallet" }),
      sortable: false,
      renderCell: (params: GridCellParams<any, string>) => {
        return (
          <AddressLink address={params.value} />
        );
      },
      flex: 1.5,
      minWidth: 150
    },
    {
      field: "referral",
      headerName: formatMessage({ id: "form.labels.referrer" }),
      sortable: false,
      renderCell: (params: GridCellParams<any, string>) => {
        return (
          <AddressLink address={params.value} />
        );
      },
      flex: 1.5,
      minWidth: 150
    },
    {
      field: "level",
      headerName: formatMessage({ id: "form.labels.level" }),
      sortable: true,
      flex: 0.3,
    },
  ];

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "referral", "referral.tree"]} />

      <PageHeader message="pages.referral.tree.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <ReferralTreeSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        onRefreshPage={handleRefreshPage}
      />

      <ProgressOverlay isLoading={isLoading}>
        <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
          <DataGrid
            pagination
            paginationMode="server"
            rowCount={count}
            paginationModel={{ page: search.skip / search.take, pageSize: search.take }}
            onPaginationModelChange={handleChangePaginationModel}
            pageSizeOptions={[5, 10, 25, 100]}
            loading={isLoading}
            columns={columns}
            rows={rows.map((tree: IReferralTree, idx) => ({
              id: idx,
              wallet: tree.wallet,
              referral: tree.referral,
              level: tree.level,
            }))}
            autoHeight
          />
        </StyledEmptyWrapper>
      </ProgressOverlay>
    </Grid>
  );
};
