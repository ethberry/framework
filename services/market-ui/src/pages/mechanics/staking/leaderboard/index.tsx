import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid, Typography } from "@mui/material";
import { Filter1, Filter2, Filter3, Filter4, FilterList } from "@mui/icons-material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { IStakingLeaderboard, IStakingLeaderboardSearchDto } from "@framework/types";
import { StakingLeaderboardRank, TokenType } from "@framework/types";

import { StakingLeaderboardSearchForm } from "./form";
import { AddressLink } from "../../../../components/common/address-link";
import { formatEther } from "../../../../utils/money";

export const StakingLeaderboard: FC = () => {
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
  } = useCollection<IStakingLeaderboard, IStakingLeaderboardSearchDto>({
    baseUrl: "/staking/leaderboard",
    search: {
      deposit: {
        tokenType: TokenType.ERC20,
        contractId: 1201,
      },
      reward: {
        tokenType: TokenType.ERC721,
        contractId: 1306,
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
        const row = params.row as IStakingLeaderboard;
        // @ts-ignore
        const index: number = params.api.getRowIndex(row.id);
        return (
          <Grid container direction="row" alignItems="center">
            {row.rank === StakingLeaderboardRank.GOLD ? <Filter1 /> : null}
            {row.rank === StakingLeaderboardRank.SILVER ? <Filter2 /> : null}
            {row.rank === StakingLeaderboardRank.BRONZE ? <Filter3 /> : null}
            {row.rank === StakingLeaderboardRank.BASIC ? <Filter4 /> : null}
            <Typography ml={1}>{index + search.skip + 1}</Typography>
          </Grid>
        );
      },
      flex: 0.3
    },
    {
      field: "account",
      headerName: formatMessage({ id: "form.labels.account" }),
      sortable: false,
      renderCell: (params: GridCellParams) => {
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
      <Breadcrumbs path={["dashboard", "staking", "staking.leaderboard"]} />

      <PageHeader message="pages.staking.leaderboard.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <StakingLeaderboardSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

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
