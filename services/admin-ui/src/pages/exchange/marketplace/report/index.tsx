import { FC, Fragment, useCallback } from "react";
import { Button } from "@mui/material";
import { CloudDownload, FilterList } from "@mui/icons-material";
import { DataGridPremium, DataGridPremiumProps, gridClasses, GridRowParams } from "@mui/x-data-grid-premium";
import { FormattedMessage, useIntl } from "react-intl";
import { addMonths, endOfMonth, format, parseISO, startOfMonth, subMonths } from "date-fns";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useApiCall, useCollection } from "@gemunion/react-hooks";
import { humanReadableDateTimeFormat } from "@gemunion/constants";
import type { IAssetComponent, IMarketplaceReportSearchDto, IToken } from "@framework/types";

import { formatPrice } from "../../../../utils/money";
import { MarketplaceReportSearchForm } from "./form";
import { ReportDataView } from "./report-data-view";

export const MarketplaceReport: FC = () => {
  const {
    rows,
    count,
    search,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    handleSearch,
    handleChangePaginationModel,
  } = useCollection<IToken, IMarketplaceReportSearchDto>({
    baseUrl: "/marketplace/report/search",
    search: {
      query: "",
      contractIds: [],
      templateIds: [],
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
    ({ row }: GridRowParams<IToken>) => <ReportDataView row={row} />,
    [],
  );

  const getDetailPanelHeight = useCallback<NonNullable<DataGridPremiumProps["getDetailPanelHeight"]>>(
    () => "auto" as const,
    [],
  );

  // prettier-ignore
  const columns = [
    {
      field: "id",
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
      field: "price",
      headerName: formatMessage({ id: "form.labels.price" }),
      sortable: true,
      valueFormatter: ({ value }: { value: Array<IAssetComponent> }) => formatPrice({ id: 0, components: value }),
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
    },
  ];

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "marketplace", "marketplace.report"]} />

      <PageHeader message="pages.marketplace.report.title">
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

      <MarketplaceReportSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <DataGridPremium
        pagination
        paginationMode="server"
        rowCount={count}
        paginationModel={{ page: search.skip / search.take, pageSize: search.take }}
        onPaginationModelChange={handleChangePaginationModel}
        pageSizeOptions={[5, 10, 25]}
        loading={isLoading}
        columns={columns}
        rowThreshold={0}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
        rows={rows.map((token: IToken) => ({
          id: token.id,
          title: token.template?.title,
          price: token.exchange![0].history?.assets,
          createdAt: token.createdAt,
          exchange: token.exchange!,
        }))}
        // rows={rows}
        getRowHeight={() => "auto"}
        sx={{
          [`& .${gridClasses.cell}`]: {
            p: 1.5,
          },
        }}
        autoHeight
      />
    </Fragment>
  );
};
