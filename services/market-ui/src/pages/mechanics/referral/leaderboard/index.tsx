import { FC } from "react";
import { useIntl } from "react-intl";
import { Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { ILeaderboard } from "@framework/types";

export const ReferralLeaderboard: FC = () => {
  const { rows, search, count, isLoading, handleSearch, handleChangeRowsPerPage, handleChangePage } =
    useCollection<ILeaderboard>({
      baseUrl: "/referral/leaderboard",
      empty: {
        wallet: "",
      },
    });

  const { formatMessage } = useIntl();

  // prettier-ignore
  const columns = [
    {
      field: "id",
      headerName: formatMessage({ id: "pages.referral.leaderboard.id" }),
      sortable: false,
      flex: 1,
    },
    {
      field: "account",
      headerName: formatMessage({ id: "pages.referral.leaderboard.account" }),
      sortable: false,
      flex: 1
    },
    {
      field: "score",
      headerName: formatMessage({ id: "pages.referral.leaderboard.score" }),
      sortable: false,
      flex: 1
    },
    {
      field: "rank",
      headerName: formatMessage({ id: "pages.referral.leaderboard.rank" }),
      sortable: false,
      flex: 1
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
