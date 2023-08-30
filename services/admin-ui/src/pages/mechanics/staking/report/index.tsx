import { FC } from "react";
import { Button, Grid } from "@mui/material";
import { CloudDownload, FilterList } from "@mui/icons-material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { FormattedMessage, useIntl } from "react-intl";
import { addMonths, endOfMonth, format, parseISO, startOfMonth, subMonths } from "date-fns";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useApiCall, useCollection } from "@gemunion/react-hooks";
import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { AddressLink } from "@gemunion/mui-scanner";
import type { IStakingDeposit, IStakingReportSearchDto } from "@framework/types";
import { StakingDepositStatus, TokenType } from "@framework/types";

import { StakingReportSearchForm } from "./form";
import { formatPrice } from "../../../../utils/money";

export const StakingReport: FC = () => {
  const {
    rows,
    count,
    search,
    isLoading,
    isFiltersOpen,
    handleSearch,
    handleToggleFilters,
    handleChangePaginationModel,
  } = useCollection<IStakingDeposit, IStakingReportSearchDto>({
    baseUrl: "/staking/report",
    empty: {
      createdAt: new Date().toISOString(),
    },
    search: {
      contractId: 1,
      account: "",
      stakingDepositStatus: [StakingDepositStatus.ACTIVE],
      deposit: {
        tokenType: TokenType.ERC20,
        contractId: 1,
      },
      reward: {
        tokenType: TokenType.ERC721,
        contractId: 1,
      },
      emptyReward: false,
      startTimestamp: startOfMonth(subMonths(new Date(), 1)).toISOString(),
      endTimestamp: endOfMonth(addMonths(new Date(), 1)).toISOString(),
    },
  });

  const { formatMessage } = useIntl();

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchFile({
      url: "/staking/report/export",
      data: values,
    });
  });

  const handleExport = (): Promise<void> => {
    return fn(void 0, search);
  };

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
      sortable: true,
      renderCell: (params: GridCellParams<any, string>) => {
        return (
          <AddressLink address={params.value} />
        );
      },
      flex: 2,
      minWidth: 360
    },
    {
      field: "deposit",
      headerName: formatMessage({ id: "form.labels.deposit" }),
      sortable: true,
      flex: 1,
      minWidth: 100
    },
    {
      field: "stakingRule",
      headerName: formatMessage({ id: "form.labels.stakingRule" }),
      sortable: true,
      flex: 1,
      minWidth: 100
    },
    {
      field: "createdAt",
      headerName: formatMessage({ id: "form.labels.createdAt" }),
      sortable: true,
      valueFormatter: ({ value }: { value: string }) => format(parseISO(value), humanReadableDateTimeFormat),
      flex: 1,
      minWidth: 160
    }
  ];

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "staking", "staking.report"]} />

      <PageHeader message="pages.staking.report.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button startIcon={<CloudDownload />} onClick={handleExport}>
          <FormattedMessage id="form.buttons.export" />
        </Button>
      </PageHeader>

      <StakingReportSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <DataGrid
        pagination
        paginationMode="server"
        rowCount={count}
        paginationModel={{ page: search.skip / search.take, pageSize: search.take }}
        onPaginationModelChange={handleChangePaginationModel}
        pageSizeOptions={[5, 10, 25]}
        loading={isLoading}
        columns={columns}
        rows={rows.map((stake: IStakingDeposit) => ({
          id: stake.id,
          account: stake.account,
          deposit: formatPrice(stake.stakingRule?.deposit),
          stakingRule: stake.stakingRule?.title,
          createdAt: stake.createdAt,
        }))}
        autoHeight
      />
    </Grid>
  );
};
