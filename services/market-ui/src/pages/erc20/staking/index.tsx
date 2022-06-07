import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { Grid, Typography } from "@mui/material";
import { Filter1, Filter2, Filter3, Filter4 } from "@mui/icons-material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { useLocation, useNavigate } from "react-router";
import { parse, stringify } from "qs";
import useDeepCompareEffect from "use-deep-compare-effect";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { IPaginationResult, ISearchDto } from "@gemunion/types-collection";
import { defaultItemsPerPage } from "@gemunion/constants";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { ILeaderboard, LeaderboardRank } from "@framework/types";

// TODO useCollection
export const Erc20Staking: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState<Array<ILeaderboard>>([]);
  const [count, setCount] = useState<number>(0);

  const { formatMessage } = useIntl();

  const parsedData = parse(location.search.substring(1));

  const [data, setData] = useState<ISearchDto>({
    skip: 0,
    take: defaultItemsPerPage,
    query: "",
    ...parsedData,
  });

  const updateQS = () => {
    const { skip: _skip, take: _take, ...rest } = data;
    navigate(`/leaderboard?${stringify(rest)}`);
  };

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/leaderboard",
        data,
      });
    },
    { success: false },
  );

  const fetchLeaders = async (): Promise<void> => {
    return fn().then((json: IPaginationResult<ILeaderboard>) => {
      setLeaders(json.rows);
      setCount(json.count);
      updateQS();
    });
  };

  const handleChangePage = (page: number): void => {
    setData({
      ...data,
      skip: page * data.take,
      take: data.take,
    });
  };

  const handleChangeRowsPerPage = (pageSize: number): void => {
    setData({
      ...data,
      skip: 0,
      take: pageSize,
    });
  };

  const handleSearch = (values: ISearchDto): Promise<void> => {
    setData({
      ...values,
      skip: 0,
    });

    return Promise.resolve();
  };

  useDeepCompareEffect(() => {
    void fetchLeaders();
  }, [data]);

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
            <Typography ml={1}>{index + data.skip + 1}</Typography>
          </Grid>
        );
      },
    },
    {
      field: "secureWallet",
      headerName: formatMessage({ id: "pages.erc20-staking.address" }),
      sortable: false,
      flex: 1,
    },
    { field: "score", headerName: formatMessage({ id: "pages.erc20-staking.score" }), sortable: false, flex: 1 },
    { field: "rank", headerName: formatMessage({ id: "pages.erc20-staking.rank" }), sortable: false, flex: 1 },
  ];

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc20-staking"]} />

      <PageHeader message="pages.erc20-staking.title" />

      <CommonSearchForm onSubmit={handleSearch} initialValues={data} />

      <DataGrid
        pagination
        paginationMode="server"
        rowCount={count}
        pageSize={data.take}
        onPageChange={handleChangePage}
        onPageSizeChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        loading={isLoading}
        columns={columns}
        rows={leaders}
        autoHeight
      />
    </Grid>
  );
};
