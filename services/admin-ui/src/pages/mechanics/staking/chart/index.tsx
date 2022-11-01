import { FC, Fragment, useEffect, useRef } from "react";
import { Box, Button } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
import * as Plot from "@observablehq/plot";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { IStakingChartSearchDto, IToken } from "@framework/types";
import { TokenType } from "@framework/types";

import { StakingChartSearchForm } from "./form";

export const StakingChart: FC = () => {
  const { rows, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch } = useCollection<
    IToken,
    IStakingChartSearchDto
  >({
    baseUrl: "/staking/chart",
    search: {
      deposit: {
        tokenType: TokenType.ERC20,
        contractId: 1201,
      },
      reward: {
        tokenType: TokenType.ERC721,
        contractId: 1306,
      },
      startTimestamp: startOfMonth(subMonths(new Date(), 1)).toISOString(),
      endTimestamp: endOfMonth(addMonths(new Date(), 1)).toISOString(),
    },
  });

  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.info("rows", rows);
    console.info("rows.length", rows.length);
    console.info("chartRef.current", chartRef.current);

    if (rows.length && chartRef.current) {
      const chart = Plot.plot({
        width: chartRef.current.clientWidth,
        style: {
          background: "inherit",
        },
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
  }, [chartRef.current, rows]);

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "staking", "staking.chart"]} />

      <PageHeader message="pages.staking.chart.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <StakingChartSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <Box mt={4} width="100%" ref={chartRef} />
      </ProgressOverlay>
    </Fragment>
  );
};
