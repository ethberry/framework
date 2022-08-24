import { FC, Fragment, useEffect, useRef } from "react";
import { Box, Button } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { endOfMonth, startOfMonth } from "date-fns";
import * as Plot from "@observablehq/plot";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { IMarketplaceReportSearchDto, IToken } from "@framework/types";

import { MarketplaceReportSearchForm } from "./form";

export const MarketplaceChart: FC = () => {
  const { rows, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch } = useCollection<
    IToken,
    IMarketplaceReportSearchDto
  >({
    baseUrl: "/marketplace/report/chart",
    search: {
      contractIds: [],
      templateIds: [],
      startTimestamp: startOfMonth(new Date()).toISOString(),
      endTimestamp: endOfMonth(new Date()).toISOString(),
    },
  });

  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) {
      if (chartRef.current) {
        const chart = Plot.plot({
          width: chartRef.current.clientWidth,
          y: {
            grid: true,
            label: "Sold items",
          },
          x: {
            label: "Date",
            thresholds: 100,
            transform: (d: string) => new Date(d),
          },
          marks: [Plot.line(rows, { y: "count", x: "date", curve: "catmull-rom", marker: "circle" }), Plot.ruleY([0])],
          color: {
            scheme: "blues",
          },
        });

        while (chartRef.current.lastChild) {
          chartRef.current.removeChild(chartRef.current.lastChild);
        }

        chartRef.current.append(chart);
      }
    }
  }, [chartRef.current, rows]);

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "marketplace", "marketplace.chart"]} />

      <PageHeader message="pages.marketplace.chart.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <MarketplaceReportSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <Box mt={4} width="100%" ref={chartRef} />
    </Fragment>
  );
};
