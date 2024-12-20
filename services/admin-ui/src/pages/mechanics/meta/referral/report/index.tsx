import { FC } from "react";
import { Button, Grid } from "@mui/material";
import { CloudDownload, FilterList } from "@mui/icons-material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { FormattedMessage, useIntl } from "react-intl";
import { addMonths, endOfMonth, format, parseISO, startOfMonth, subMonths } from "date-fns";

import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { useCollection } from "@gemunion/provider-collection";
import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { AddressLink } from "@gemunion/mui-scanner";
// import { formatEther } from "@framework/exchange";
import type { IReferralReportSearchDto, IReferralEvents } from "@framework/types";
import { formatItem } from "@framework/exchange";

// TODO rework to use assets
export const ReferralReport: FC = () => {
  const {
    rows,
    count,
    search,
    isLoading,
    isFiltersOpen,
    handleSearch,
    handleToggleFilters,
    handleChangePaginationModel,
  } = useCollection<IReferralEvents, IReferralReportSearchDto>({
    baseUrl: "/referral/report/search",
    empty: {
      createdAt: new Date().toISOString(),
    },
    search: {
      query: "",
      startTimestamp: startOfMonth(subMonths(new Date(), 1)).toISOString(),
      endTimestamp: endOfMonth(addMonths(new Date(), 1)).toISOString(),
    },
  });

  const { formatMessage } = useIntl();

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchFile({
      url: "/referral/report/export",
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
      field: "referrer",
      headerName: formatMessage({ id: "form.labels.referrer" }),
      sortable: false,
      renderCell: (params: GridCellParams<any, string>) => {
        return (
          <AddressLink address={params.value} length={42} />
        );
      },
      flex: 3,
      minWidth: 360
    },
    {
      field: "referral",
      headerName: formatMessage({ id: "form.labels.referral" }),
      sortable: false,
      renderCell: (params: GridCellParams<any, string>) => {
        return (
          <AddressLink address={params.value} length={42} />
        );
      },
      flex: 3,
      minWidth: 360
    },
    {
      field: "item",
      headerName: formatMessage({ id: "form.labels.item" }),
      sortable: true,
      flex: 1,
      minWidth: 100
    },
    {
      field: "price",
      headerName: formatMessage({ id: "form.labels.price" }),
      sortable: true,
      flex: 1,
      minWidth: 100
    },
    {
      field: "contract",
      headerName: formatMessage({ id: "form.labels.contract" }),
      sortable: true,
      flex: 1,
      minWidth: 100
    },
    {
      field: "event",
      headerName: formatMessage({ id: "form.labels.eventType" }),
      sortable: true,
      flex: 1,
      minWidth: 100
    },
    {
      field: "createdAt",
      headerName: formatMessage({ id: "form.labels.createdAt" }),
      sortable: true,
      valueFormatter: (value: string) => format(parseISO(value), humanReadableDateTimeFormat),
      flex: 1,
      minWidth: 160
    }
  ];

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "referral", "referral.report"]} />

      <PageHeader message="pages.referral.report.title">
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
        testId="ReferralReportSearchForm"
      >
        <Grid container spacing={2} alignItems="flex-end">
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
        rows={rows.map((reward: IReferralEvents) => ({
          id: reward.id,
          referrer: reward.referrer,
          referral: reward.account,
          item: formatItem(reward.item),
          price: formatItem(reward.price),
          event: reward.history?.eventType,
          contract: reward.contract!.title,
          createdAt: reward.createdAt,
        }))}
        autoHeight
      />
    </Grid>
  );
};
