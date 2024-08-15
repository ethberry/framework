import { FC, Fragment, useCallback, useEffect, useRef } from "react";
import { Box, Button } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
import * as Plot from "@observablehq/plot";
import { utils } from "ethers";

import { StyledEmptyWrapper } from "@framework/styled";
import type { IMarketplaceReportSearchDto, IToken, IUser } from "@framework/types";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/provider-collection";
import { useUser } from "@gemunion/provider-user";

import { MarketplaceChartSearchForm } from "./form";

export const MarketplaceChart: FC = () => {
  const { profile } = useUser<IUser>();

  const { rows, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch } = useCollection<
    IToken,
    IMarketplaceReportSearchDto
  >({
    baseUrl: "/marketplace/report/chart",
    search: {
      contractIds: [],
      templateIds: [],
      merchantId: profile.merchantId,
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
          line: true,
          nice: true,
          labelAnchor: "top",
          transform: (d: string | number) => Number(d),
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
                grid: true,
                line: true,
                nice: true,
                transform: (d: string | null) => (d ? Number(utils.formatUnits(d, 18)) : 0),
                tickFormat: (d: string) => `Ξ ${d}`,
                zero: true,
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
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <MarketplaceChartSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
          <Box mt={4} width="100%" ref={chartRef} />
        </StyledEmptyWrapper>
      </ProgressOverlay>
    </Fragment>
  );
};
