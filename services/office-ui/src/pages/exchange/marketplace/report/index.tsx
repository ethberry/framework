import { FC, Fragment, useCallback } from "react";
import { Button } from "@mui/material";
import { CloudDownload, FilterList } from "@mui/icons-material";
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridCellParams,
  gridClasses,
  GridRowParams,
} from "@mui/x-data-grid-premium";
import { FormattedMessage, useIntl } from "react-intl";
import { addMonths, endOfMonth, format, parseISO, startOfMonth, subMonths } from "date-fns";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { useCollection } from "@gemunion/provider-collection";
import { useUser } from "@gemunion/provider-user";
import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { AddressLink } from "@gemunion/mui-scanner";
import { formatItem } from "@framework/exchange";
import type { IAssetComponent, IMarketplaceReport, IMarketplaceReportSearchDto, IUser } from "@framework/types";

import { MarketplaceReportDataView } from "./report-data-view";
import { MarketplaceReportSearchForm } from "./form";

export const MarketplaceReport: FC = () => {
  const { profile } = useUser<IUser>();

  const {
    rows,
    count,
    search,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    handleSearch,
    handleChangePaginationModel,
    handleRefreshPage,
  } = useCollection<IMarketplaceReport, IMarketplaceReportSearchDto>({
    baseUrl: "/marketplace/report/search",
    search: {
      query: "",
      contractIds: [],
      templateIds: [],
      merchantId: profile.merchantId,
      startTimestamp: startOfMonth(subMonths(new Date(), 1)).toISOString(),
      endTimestamp: endOfMonth(addMonths(new Date(), 1)).toISOString(),
    },
  });
  const { formatMessage } = useIntl();

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchFile({
      url: "/marketplace/report/export",
      data: values,
    });
  });

  const handleExport = (): Promise<void> => {
    return fn(void 0, search);
  };

  const getDetailPanelContent = useCallback<NonNullable<DataGridPremiumProps["getDetailPanelContent"]>>(
    ({ row }: GridRowParams<IMarketplaceReport>) => <MarketplaceReportDataView row={row} />,
    [],
  );

  const getDetailPanelHeight = useCallback<NonNullable<DataGridPremiumProps["getDetailPanelHeight"]>>(
    () => "auto" as const,
    [],
  );

  // prettier-ignore
  const columns = [
    {
      field: "tokenId",
      headerName: formatMessage({ id: "form.labels.id" }),
      sortable: true,
      flex: 0
    },
    {
      field: "title",
      headerName: formatMessage({ id: "form.labels.title" }),
      sortable: false,
      flex: 1,
      minWidth: 200
    },
    {
      field: "account",
      headerName: formatMessage({ id: "form.labels.address" }),
      sortable: false,
      renderCell: (params: GridCellParams<any, string>) => {
        return (
          <AddressLink address={params.value} length={18} />
        );
      },
      flex: 1,
      minWidth: 200
    },
    {
      field: "price",
      headerName: formatMessage({ id: "form.labels.price" }),
      sortable: true,
      valueFormatter: (value: Array<IAssetComponent>) => formatItem({ id: 0, components: value }),
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
    },
  ];

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "marketplace", "marketplace.report"]} />

      <PageHeader message="pages.marketplace.report.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button startIcon={<CloudDownload />} onClick={handleExport}>
          <FormattedMessage id="form.buttons.export" />
        </Button>
      </PageHeader>

      <MarketplaceReportSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={{}}
        onRefreshPage={handleRefreshPage}
      />

      <DataGridPremium
        pagination
        paginationMode="server"
        rowCount={count}
        paginationModel={{ page: search.skip / search.take, pageSize: search.take }}
        onPaginationModelChange={handleChangePaginationModel}
        pageSizeOptions={[5, 10, 25]}
        loading={isLoading}
        columns={columns}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
        rows={rows.map((event: IMarketplaceReport) => {
          return {
            id: event.id,
            tokenId: event.items[0]?.token?.id,
            title: event.items[0]?.token?.template?.title,
            account: (event.eventData as any).account,
            eventData: event.eventData,
            eventType: event.eventType,
            price: event.price,
            createdAt: event.createdAt,
            items: event.items,
          };
        })}
        getRowHeight={() => "auto"}
        sx={{
          [`& .${gridClasses.cell}`]: {
            p: 1.5,
          },
        }}
        autoHeight
        disableAggregation
        disableRowGrouping
      />
    </Fragment>
  );
};
