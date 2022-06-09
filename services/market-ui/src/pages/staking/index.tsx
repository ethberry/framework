import { FC } from "react";
import { useIntl } from "react-intl";
import { Grid, Typography } from "@mui/material";
import { Filter1, Filter2, Filter3, Filter4 } from "@mui/icons-material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { stringify } from "qs";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { ILeaderboard, LeaderboardRank } from "@framework/types";

export const Staking: FC = () => {
  const { rows, search, count, isLoading, handleSearch, handleChangeRowsPerPage, handleChangePage } =
    useCollection<ILeaderboard>({
      baseUrl: "/staking/leaderboard",
      redirect: (_baseUrl, search) => `/staking?${stringify(search)}`,
    });

  const { formatMessage } = useIntl();

  // prettier-ignore
  const columns = [
    {
      field: "id",
      headerName: formatMessage({ id: "pages.erc20-staking.rank" }),
      sortable: false,
      flex: 1,
      renderCell: (cell: GridCellParams) => {
        const row = cell.row as ILeaderboard;
        // @ts-ignore
        const index: number = cell.api.getRowIndex(row.id);
        return (
          <Grid container direction="row" alignItems="center">
            {row.rank === LeaderboardRank.GOLD ? <Filter1 /> : null}
            {row.rank === LeaderboardRank.SILVER ? <Filter2 /> : null}
            {row.rank === LeaderboardRank.BRONZE ? <Filter3 /> : null}
            {row.rank === LeaderboardRank.BASIC ? <Filter4 /> : null}
            <Typography ml={1}>{index + search.skip + 1}</Typography>
          </Grid>
        );
      }
    },
    {
      field: "secureWallet",
      headerName: formatMessage({ id: "pages.erc20-staking.address" }),
      sortable: false,
      flex: 1
    },
    {
      field: "score",
      headerName: formatMessage({ id: "pages.erc20-staking.score" }),
      sortable: false,
      flex: 1
    },
    {
      field: "rank",
      headerName: formatMessage({ id: "pages.erc20-staking.rank" }),
      sortable: false,
      flex: 1
    }
  ];

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc20-staking"]} />

      <PageHeader message="pages.erc20-staking.title" />

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
