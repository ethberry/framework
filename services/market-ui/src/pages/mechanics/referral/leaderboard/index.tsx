import { FC } from "react";
import { useIntl } from "react-intl";
import { Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { IReferralLeaderboard } from "@framework/types";

import { formatEther } from "../../../../utils/money";

export const ReferralLeaderboard: FC = () => {
  const { rows, search, count, isLoading, handleSearch, handleChangeRowsPerPage, handleChangePage } =
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
      headerName: formatMessage({id: "pages.referral.leaderboard.id"}),
      sortable: true,
      flex: 0,
    },
    {
      field: "account",
      headerName: formatMessage({id: "pages.referral.leaderboard.account"}),
      sortable: false,
      flex: 1
    },
    {
      field: "amount",
      headerName: formatMessage({id: "pages.referral.leaderboard.amount"}),
      sortable: true,
      valueFormatter: ({value}: { value: string }) => formatEther(value),
      flex: 1
    },
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
        pageSize={search.take}
        onPageChange={page => handleChangePage(null as any, page)}
        onPageSizeChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        loading={isLoading}
        columns={columns}
        rows={rows}
        autoHeight
      />
    </Grid>
  );
};
