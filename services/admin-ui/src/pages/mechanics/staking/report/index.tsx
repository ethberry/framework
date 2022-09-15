import { FC } from "react";
import { Button, Grid } from "@mui/material";
import { CloudDownload, FilterList } from "@mui/icons-material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { FormattedMessage, useIntl } from "react-intl";
import { addMonths, endOfMonth, format, parseISO, startOfMonth, subMonths } from "date-fns";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import type { IStakingReportSearchDto, IStakingStake } from "@framework/types";
import { StakeStatus, TokenType } from "@framework/types";
import { useApiCall, useCollection } from "@gemunion/react-hooks";
import { humanReadableDateTimeFormat } from "@gemunion/constants";

import { StakingReportSearchForm } from "./form";
import { formatPrice } from "../../../../utils/money";
import { ScannerLink } from "../../../../components/common/scanner-link";

export const StakingReport: FC = () => {
  const {
    rows,
    count,
    search,
    isLoading,
    isFiltersOpen,
    handleSearch,
    handleToggleFilters,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useCollection<IStakingStake, IStakingReportSearchDto>({
    baseUrl: "/staking/report/search",
    empty: {
      createdAt: new Date().toISOString(),
    },
    search: {
      query: "",
      account: "",
      stakeStatus: [StakeStatus.ACTIVE],
      deposit: {
        tokenType: TokenType.ERC20,
        contractId: 201,
      },
      reward: {
        tokenType: TokenType.ERC721,
        contractId: 306,
      },
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
      flex: 0
    },
    {
      field: "account",
      headerName: formatMessage({ id: "form.labels.account" }),
      sortable: true,
      renderCell: (params: GridCellParams) => {
        return (
          <ScannerLink address={params.value} />
        );
      },
      flex: 1
    },
    {
      field: "deposit",
      headerName: formatMessage({ id: "form.labels.deposit" }),
      sortable: true,
      flex: 1
    },
    {
      field: "createdAt",
      headerName: formatMessage({ id: "form.labels.createdAt" }),
      sortable: true,
      valueFormatter: ({ value }: { value: string }) => format(parseISO(value), humanReadableDateTimeFormat),
      flex: 1
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
        pageSize={search.take}
        onPageChange={page => handleChangePage(null as any, page + 1)}
        onPageSizeChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        loading={isLoading}
        columns={columns}
        rows={rows.map((stake: IStakingStake) => ({
          id: stake.id,
          account: stake.account,
          deposit: formatPrice(stake.stakingRule?.deposit),
          createdAt: stake.createdAt,
        }))}
        autoHeight
      />
    </Grid>
  );
};
