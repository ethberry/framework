import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { FormattedMessage, useIntl } from "react-intl";
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { IAsset, IMarketplaceInsightsSearchDto, IToken } from "@framework/types";

import { MarketplaceInsightsSearchForm } from "./form";
import { formatPrice } from "../../../utils/money";

export const Marketplace: FC = () => {
  const {
    rows,
    count,
    search,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    handleSearch,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useCollection<IToken, IMarketplaceInsightsSearchDto>({
    baseUrl: "/marketplace/insights",
    search: {
      contractIds: [],
      templateIds: [],
      startTimestamp: startOfMonth(new Date()).toISOString(),
      endTimestamp: endOfMonth(new Date()).toISOString(),
    },
  });

  const { formatMessage } = useIntl();

  // prettier-ignore
  const columns = [
    {
      field: "id",
      headerName: formatMessage({ id: "pages.marketplace.insights.id" }),
      sortable: true,
      flex: 0
    },
    {
      field: "title",
      headerName: formatMessage({ id: "pages.marketplace.insights.title" }),
      sortable: false,
      flex: 1
    },
    {
      field: "createdAt",
      headerName: formatMessage({ id: "pages.marketplace.insights.createdAt" }),
      sortable: true,
      valueFormatter: ({ value }: { value: string }) => format(parseISO(value), humanReadableDateTimeFormat),
      flex: 1
    },
    {
      field: "price",
      headerName: formatMessage({ id: "pages.marketplace.insights.price" }),
      sortable: true,
      valueFormatter: ({ value }: { value: IAsset }) => formatPrice(value),
      flex: 1
    }
  ];

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "marketplace"]} />

      <PageHeader message="pages.marketplace.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <MarketplaceInsightsSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <DataGrid
        pagination
        paginationMode="server"
        rowCount={count}
        pageSize={search.take}
        onPageChange={page => handleChangePage(null as any, page)}
        onPageSizeChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        loading={isLoading}
        columns={columns}
        rows={rows.map((token: IToken) => ({
          id: token.id,
          createdAt: token.createdAt,
          title: token.template?.title,
          price: token.template?.price,
        }))}
        autoHeight
      />
    </Fragment>
  );
};
