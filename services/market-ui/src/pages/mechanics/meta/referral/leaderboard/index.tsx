import { FC } from "react";
import { useIntl } from "react-intl";
import { Grid } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/provider-collection";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { AddressLink } from "@gemunion/mui-scanner";
import { formatEther } from "@framework/exchange";
import type { IReferralLeaderboard } from "@framework/types";

export const ReferralLeaderboard: FC = () => {
  const { rows, search, count, isLoading, handleSearch, handleChangePaginationModel } =
    useCollection<IReferralLeaderboard>({
      baseUrl: "/referral/leaderboard",
      empty: {
        account: "",
      },
    });

  const { formatMessage } = useIntl();

  // prettier-ignore
  const columns = [
    {
      field: "id",
      headerName: formatMessage({ id: "form.labels.id" }),
      sortable: true,
      flex: 0.3
    },
    {
      field: "account",
      headerName: formatMessage({ id: "form.labels.account" }),
      sortable: false,
      renderCell: (params: GridCellParams<any, string>) => {
        return (
          <AddressLink address={params.value} />
        );
      },
      flex: 3,
      minWidth: 360
    },
    {
      field: "amount",
      headerName: formatMessage({ id: "form.labels.amount" }),
      sortable: true,
      valueFormatter: (value: string) => formatEther(value),
      flex: 1,
      minWidth: 100
    }
  ];

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "referral", "referral.leaderboard"]} />

      <PageHeader message="pages.referral.leaderboard.title" />

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} />

      <DataGrid
        pagination
        paginationMode="server"
        rowCount={count}
        paginationModel={{ page: search.skip / search.take, pageSize: search.take }}
        onPaginationModelChange={handleChangePaginationModel}
        pageSizeOptions={[5, 10, 25]}
        loading={isLoading}
        columns={columns}
        rows={rows}
        autoHeight
      />
    </Grid>
  );
};
