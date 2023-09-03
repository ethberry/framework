import { FC, Fragment } from "react";
import { Button, Grid } from "@mui/material";
import { CloudDownload, FilterList } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { FormattedMessage, useIntl } from "react-intl";
import { addMonths, endOfMonth, format, parseISO, startOfMonth, subMonths } from "date-fns";

import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useApiCall, useCollection } from "@gemunion/react-hooks";
import { humanReadableDateTimeFormat } from "@gemunion/constants";
import type { IAssetComponent, IMarketplaceReportSearchDto, IToken } from "@framework/types";
import { TokenType } from "@framework/types";

import { formatPrice } from "../../../../utils/money";
import { TemplateInput } from "../../../../components/inputs/template";

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
    }
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

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} testId="ClaimSearchForm">
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={6}>
            <DateTimeInput name="startTimestamp" />
          </Grid>
          <Grid item xs={12} md={6}>
            <DateTimeInput name="endTimestamp" />
          </Grid>
          <Grid item xs={12} md={6}>
            <EntityInput
              name="contractIds"
              controller="contracts"
              multiple
              data={{ contractType: [TokenType.ERC721, TokenType.ERC1155] }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TemplateInput />
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
        rows={rows.map((token: IToken) => ({
          id: token.id,
          title: token.template?.title,
          price: token.exchange![0].history?.assets,
          createdAt: token.createdAt,
        }))}
        autoHeight
      />
    </Fragment>
  );
};
