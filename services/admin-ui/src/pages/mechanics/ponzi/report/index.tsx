import { FC } from "react";
import { Button, Grid } from "@mui/material";
import { CloudDownload, FilterList } from "@mui/icons-material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { FormattedMessage, useIntl } from "react-intl";
import { addMonths, endOfMonth, format, parseISO, startOfMonth, subMonths } from "date-fns";

import { SelectInput, SwitchInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useApiCall, useCollection } from "@gemunion/react-hooks";
import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { AddressLink } from "@gemunion/mui-scanner";
import type { IPonziDeposit, IPonziReportSearchDto } from "@framework/types";
import { ModuleType, PonziDepositStatus, TokenType } from "@framework/types";

import { formatPrice } from "../../../../utils/money";
import { SearchTokenSelectInput } from "../../../../components/inputs/search-token-select";
import { SearchContractInput } from "../../../../components/inputs/search-contract";

export const PonziReport: FC = () => {
  const {
    rows,
    count,
    search,
    isLoading,
    isFiltersOpen,
    handleSearch,
    handleToggleFilters,
    handleChangePaginationModel,
  } = useCollection<IPonziDeposit, IPonziReportSearchDto>({
    baseUrl: "/ponzi/report",
    empty: {
      createdAt: new Date().toISOString(),
    },
    search: {
      contractId: undefined,
      account: "",
      ponziDepositStatus: [PonziDepositStatus.ACTIVE],
      deposit: {
        tokenType: TokenType.ERC20,
        contractId: undefined,
      },
      reward: {
        tokenType: TokenType.ERC20,
        contractId: undefined,
      },
      emptyReward: false,
      startTimestamp: startOfMonth(subMonths(new Date(), 1)).toISOString(),
      endTimestamp: endOfMonth(addMonths(new Date(), 1)).toISOString(),
    },
  });

  const { formatMessage } = useIntl();

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchFile({
      url: "/ponzi/report/export",
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
      field: "ponziRule",
      headerName: formatMessage({ id: "form.labels.ponziRule" }),
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
      <Breadcrumbs path={["dashboard", "ponzi", "ponzi.report"]} />

      <PageHeader message="pages.ponzi.report.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button startIcon={<CloudDownload />} onClick={handleExport}>
          <FormattedMessage id="form.buttons.export" />
        </Button>
      </PageHeader>

      <CommonSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        name="account"
        testId="PonziReportSearchForm"
      >
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <EntityInput
              name="contractId"
              controller="contracts"
              data={{ contractModule: [ModuleType.STAKING] }}
              autoselect
              disableClear
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput name="ponziDepositStatus" options={PonziDepositStatus} multiple />
          </Grid>
          <Grid item xs={12}>
            <SwitchInput name="emptyReward" />
          </Grid>
          <Grid item xs={6}>
            <SearchTokenSelectInput prefix="deposit" />
          </Grid>
          <Grid item xs={6}>
            <SearchTokenSelectInput prefix="reward" />
          </Grid>
          <Grid item xs={6}>
            <SearchContractInput prefix="deposit" />
          </Grid>
          <Grid item xs={6}>
            <SearchContractInput prefix="reward" />
          </Grid>
          <Grid item xs={6}>
            <DateTimeInput name="startTimestamp" />
          </Grid>
          <Grid item xs={6}>
            <DateTimeInput name="endTimestamp" />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <DataGrid
        pagination
        paginationMode="server"
        rowCount={count}
        paginationModel={{ page: search.skip / search.take, pageSize: search.take }}
        onPaginationModelChange={handleChangePaginationModel}
        pageSizeOptions={[5, 10, 25]}
        loading={isLoading}
        columns={columns}
        rows={rows.map((stake: IPonziDeposit) => ({
          id: stake.id,
          account: stake.account,
          deposit: formatPrice(stake.ponziRule?.deposit),
          ponziRule: stake.ponziRule!.title,
          createdAt: stake.createdAt,
        }))}
        autoHeight
      />
    </Grid>
  );
};
