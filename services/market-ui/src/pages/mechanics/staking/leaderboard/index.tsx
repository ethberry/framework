import { FC } from "react";
import { useIntl } from "react-intl";
import { Grid, Typography } from "@mui/material";
import { Filter1, Filter2, Filter3, Filter4 } from "@mui/icons-material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { IStakingLeaderboard, StakingLeaderboardRank } from "@framework/types";

export const StakingLeaderboard: FC = () => {
  const { rows, search, count, isLoading, handleSearch, handleChangeRowsPerPage, handleChangePage } =
    useCollection<IStakingLeaderboard>({
      baseUrl: "/staking/leaderboard",
      empty: {
        wallet: "",
      },
    });

  const { formatMessage } = useIntl();

  // prettier-ignore
  const columns = [
    {
      field: "id",
      headerName: formatMessage({ id: "form.labels.rank" }),
      sortable: false,
      flex: 1,
      renderCell: (cell: GridCellParams) => {
        const row = cell.row as IStakingLeaderboard;
        // @ts-ignore
        const index: number = cell.api.getRowIndex(row.id);
        return (
          <Grid container direction="row" alignItems="center">
            {row.rank === StakingLeaderboardRank.GOLD ? <Filter1 /> : null}
            {row.rank === StakingLeaderboardRank.SILVER ? <Filter2 /> : null}
            {row.rank === StakingLeaderboardRank.BRONZE ? <Filter3 /> : null}
            {row.rank === StakingLeaderboardRank.BASIC ? <Filter4 /> : null}
            <Typography ml={1}>{index + search.skip + 1}</Typography>
          </Grid>
        );
      }
    },
    {
      field: "account",
      headerName: formatMessage({ id: "form.labels.account" }),
      sortable: false,
      flex: 1
    },
    {
      field: "score",
      headerName: formatMessage({ id: "form.labels.score" }),
      sortable: false,
      flex: 1
    },
    {
      field: "rank",
      headerName: formatMessage({ id: "form.labels.rank" }),
      sortable: false,
      flex: 1
    }
  ];

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "staking", "staking.leaderboard"]} />

      <PageHeader message="pages.staking.leaderboard.title" />

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} />

      <DataGrid
        pagination
        paginationMode="server"
        rowCount={count}
        pageSize={search.take}
        onPageChange={page => handleChangePage(null as any, page + 1)}
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
