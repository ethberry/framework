import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid, Typography } from "@mui/material";
import { Filter1, Filter2, Filter3, Filter4, FilterList } from "@mui/icons-material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { AddressLink } from "@gemunion/mui-scanner";
import { InputType } from "@gemunion/types-collection";
import type { IPonziLeaderboard, IPonziLeaderboardSearchDto } from "@framework/types";
import { PonziLeaderboardRank, TokenType } from "@framework/types";

import { PonziLeaderboardSearchForm } from "./form";
import { formatEther } from "../../../../utils/money";

export const PonziLeaderboard: FC = () => {
  const {
    rows,
    search,
    count,
    isLoading,
    isFiltersOpen,
    handleSearch,
    handleChangePaginationModel,
    handleToggleFilters,
  } = useCollection<IPonziLeaderboard, IPonziLeaderboardSearchDto>({
    baseUrl: "/ponzi/leaderboard",
    search: {
      deposit: {
        tokenType: TokenType.ERC20,
        contractId: InputType.awaited,
      },
      reward: {
        tokenType: TokenType.ERC20,
        contractId: InputType.awaited,
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
      renderCell: (params: GridCellParams) => {
        const row = params.row as IPonziLeaderboard;
        // @ts-ignore
        const index: number = params.api.getRowIndexRelativeToVisibleRows(row.id);
        return (
          <Grid container direction="row" alignItems="center">
            {row.rank === PonziLeaderboardRank.GOLD ? <Filter1 /> : null}
            {row.rank === PonziLeaderboardRank.SILVER ? <Filter2 /> : null}
            {row.rank === PonziLeaderboardRank.BRONZE ? <Filter3 /> : null}
            {row.rank === PonziLeaderboardRank.BASIC ? <Filter4 /> : null}
            <Typography ml={1}>{index + search.skip + 1}</Typography>
          </Grid>
        );
      },
      flex: 0.5,
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
      sortable: false,
      valueFormatter: ({ value }: { value: string }) => formatEther(value),
      flex: 1,
      minWidth: 100
    },
    {
      field: "name",
      headerName: formatMessage({ id: "form.labels.title" }),
      sortable: false,
      flex: 1,
      minWidth: 170
    }
  ];

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "ponzi", "ponzi.leaderboard"]} />

      <PageHeader message="pages.ponzi.leaderboard.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <PonziLeaderboardSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

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
