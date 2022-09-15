import { FC } from "react";
import { Button, Grid } from "@mui/material";
import { CloudDownload, FilterList } from "@mui/icons-material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { FormattedMessage, useIntl } from "react-intl";
import { addMonths, endOfMonth, format, parseISO, startOfMonth, subMonths } from "date-fns";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import type { IPyramidReportSearchDto, IPyramidDeposit } from "@framework/types";
import { PyramidDepositStatus, TokenType } from "@framework/types";
import { useApiCall, useCollection } from "@gemunion/react-hooks";
import { humanReadableDateTimeFormat } from "@gemunion/constants";

import { PyramidReportSearchForm } from "./form";
import { formatPrice } from "../../../../utils/money";
import { ScannerLink } from "../../../../components/common/scanner-link";

export const PyramidReport: FC = () => {
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
  } = useCollection<IPyramidDeposit, IPyramidReportSearchDto>({
    baseUrl: "/pyramid/report",
    empty: {
      createdAt: new Date().toISOString(),
    },
    search: {
      query: "",
      account: "",
      pyramidDepositStatus: [PyramidDepositStatus.ACTIVE],
      deposit: {
        tokenType: TokenType.ERC20,
        contractId: 201,
      },
      reward: {
        tokenType: TokenType.ERC20,
        contractId: 201,
      },
      startTimestamp: startOfMonth(subMonths(new Date(), 1)).toISOString(),
      endTimestamp: endOfMonth(addMonths(new Date(), 1)).toISOString(),
    },
  });

  const { formatMessage } = useIntl();

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchFile({
      url: "/pyramid/report/export",
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
      <Breadcrumbs path={["dashboard", "pyramid", "pyramid.report"]} />

      <PageHeader message="pages.pyramid.report.title">
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

      <PyramidReportSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

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
        rows={rows.map((stake: IPyramidDeposit) => ({
          id: stake.id,
          account: stake.account,
          deposit: formatPrice(stake.pyramidRule?.deposit),
          createdAt: stake.createdAt,
        }))}
        autoHeight
      />
    </Grid>
  );
};
