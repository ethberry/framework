import { FC, Fragment, useCallback, useEffect, useRef } from "react";
import { Box, Button } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
import * as Plot from "@observablehq/plot";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { IMarketplaceReportSearchDto, IToken } from "@framework/types";

import { MarketplaceChartSearchForm } from "./form";
import { formatEther } from "../../../../utils/money";

export const MarketplaceChart: FC = () => {
  const { rows, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch } = useCollection<
    IToken,
    IMarketplaceReportSearchDto
  >({
    baseUrl: "/marketplace/report/chart",
    search: {
      contractIds: [],
      templateIds: [],
      startTimestamp: startOfMonth(subMonths(new Date(), 1)).toISOString(),
      endTimestamp: endOfMonth(addMonths(new Date(), 1)).toISOString(),
    },
  });

  const chartRef = useRef<HTMLDivElement>(null);

  const clearChart = useCallback(() => {
    while (chartRef.current?.lastChild) {
      chartRef.current.removeChild(chartRef.current.lastChild);
    }
  }, [chartRef.current]);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    if (!rows.length) {
      clearChart();
    } else {
      const width = chartRef.current.clientWidth;
      const height = 400;

      const chart = Plot.plot({
        width: Math.min(width, 780),
        height,
        marginLeft: 70,
        marginRight: 50,
        marginBottom: 40,
        style: {
          background: "inherit",
        },
        y: {
          axis: "left",
          grid: true,
          label: "Sold items",
          nice: true,
          labelAnchor: "top",
          labelOffset: 40,
        },
        x: {
          label: "Date",
          type: "band",
          line: true,
          nice: true,
          thresholds: 100,
          labelAnchor: "center",
          transform: (d: string) => new Date(d),
        },
        marks: [
          Plot.barY(rows, { y: "count", x: "date", fill: "#ccc" }),
          () =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            Plot.plot({
              width: Math.min(width, 780),
              height,
              marginLeft: 70,
              marginRight: 50,
              marginBottom: 40,
              style: {
                background: "inherit",
              },
              x: {
                type: "band",
                axis: null,
                nice: true,
                transform: (d: string) => new Date(d),
              },
              y: {
                axis: "right",
                label: "Gained profit",
                line: true,
                nice: true,
                transform: (d: string) => formatEther(String(d)),
                reverse: true,
              },
              marks: [
                Plot.line(rows, {
                  y: "sum",
                  x: "date",
                  curve: "catmull-rom",
                  marker: "circle",
                }),
              ],
              color: {
                scheme: "blues",
              },
            }),
        ],
        color: {
          scheme: "blues",
        },
      });

      clearChart();

      chartRef.current.append(chart);
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

      <MarketplaceChartSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <Box mt={4} width="100%" ref={chartRef} />
      </ProgressOverlay>
    </Fragment>
  );
};
