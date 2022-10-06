import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid, Typography } from "@mui/material";
import { Filter1, Filter2, Filter3, Filter4, FilterList } from "@mui/icons-material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { IPyramidLeaderboard, IPyramidLeaderboardSearchDto } from "@framework/types";
import { PyramidLeaderboardRank, TokenType } from "@framework/types";

import { PyramidLeaderboardSearchForm } from "./form";
import { ScannerLink } from "../../../../components/common/scanner-link";
import { formatEther } from "../../../../utils/money";

export const PyramidLeaderboard: FC = () => {
  const {
    rows,
    search,
    count,
    isLoading,
    isFiltersOpen,
    handleSearch,
    handleChangeRowsPerPage,
    handleChangePage,
    handleToggleFilters,
  } = useCollection<IPyramidLeaderboard, IPyramidLeaderboardSearchDto>({
    baseUrl: "/pyramid/leaderboard",
    search: {
      deposit: {
        tokenType: TokenType.ERC20,
        contractId: 201,
      },
      reward: {
        tokenType: TokenType.ERC20,
        contractId: 201,
      },
    },
  });

  const { formatMessage } = useIntl();

  // prettier-ignore
  const columns = [
    {
      field: "id",
      headerName: formatMessage({ id: "form.labels.rank" }),
      sortable: false,
      flex: 0.5,
      renderCell: (params: GridCellParams) => {
        const row = params.row as IPyramidLeaderboard;
        // @ts-ignore
        const index: number = params.api.getRowIndex(row.id);
        return (
          <Grid container direction="row" alignItems="center">
            {row.rank === PyramidLeaderboardRank.GOLD ? <Filter1 /> : null}
            {row.rank === PyramidLeaderboardRank.SILVER ? <Filter2 /> : null}
            {row.rank === PyramidLeaderboardRank.BRONZE ? <Filter3 /> : null}
            {row.rank === PyramidLeaderboardRank.BASIC ? <Filter4 /> : null}
            <Typography ml={1}>{index + search.skip + 1}</Typography>
          </Grid>
        );
      }
    },
    {
      field: "account",
      headerName: formatMessage({ id: "form.labels.account" }),
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <ScannerLink address={params.value} type={"address"} />
        );
      },
      flex: 2
    },
    {
      field: "amount",
      headerName: formatMessage({ id: "form.labels.amount" }),
      sortable: false,
      valueFormatter: ({ value }: { value: string }) => formatEther(value),
      flex: 1
    },
    {
      field: "name",
      headerName: formatMessage({ id: "form.labels.title" }),
      sortable: false,
      flex: 1
    }
  ];

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "pyramid", "pyramid.leaderboard"]} />

      <PageHeader message="pages.pyramid.leaderboard.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <PyramidLeaderboardSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

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
