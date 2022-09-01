import { FC, Fragment, useEffect, useRef } from "react";
import { Box, Button } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { endOfMonth, startOfMonth } from "date-fns";
import * as Plot from "@observablehq/plot";
import { BigNumber } from "ethers";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { IReferralReportSearchDto, IToken } from "@framework/types";

import { ReferralReportSearchForm } from "./form";

export const ReferralChart: FC = () => {
  const { rows, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch } = useCollection<
    IToken,
    IReferralReportSearchDto
  >({
    baseUrl: "/referral/report/chart",
    search: {
      startTimestamp: startOfMonth(new Date()).toISOString(),
      endTimestamp: endOfMonth(new Date()).toISOString(),
    },
  });

  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) {
      if (chartRef1.current) {
        const chart = Plot.plot({
          width: chartRef1.current.clientWidth,
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

        while (chartRef1.current.lastChild) {
          chartRef1.current.removeChild(chartRef1.current.lastChild);
        }

        chartRef1.current.append(chart);
      }
    }
  }, [chartRef1.current, rows]);

  useEffect(() => {
    if (isLoading) {
      if (chartRef2.current) {
        const chart = Plot.plot({
          width: chartRef2.current.clientWidth,
          y: {
            grid: true,
            label: "Gained profit",
            transform: (d: BigNumber) => BigNumber.from(d).div(1e15).toNumber(),
          },
          x: {
            label: "Date",
            thresholds: 100,
            transform: (d: string) => new Date(d),
          },
          marks: [Plot.line(rows, { y: "amount", x: "date", curve: "catmull-rom", marker: "circle" }), Plot.ruleY([0])],
          color: {
            scheme: "blues",
          },
        });

        while (chartRef2.current.lastChild) {
          chartRef2.current.removeChild(chartRef2.current.lastChild);
        }

        chartRef2.current.append(chart);
      }
    }
  }, [chartRef2.current, rows]);

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "referral", "referral.chart"]} />

      <PageHeader message="pages.referral.chart.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <ReferralReportSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <Box mt={4} width="100%" ref={chartRef1} />
      <Box mt={4} width="100%" ref={chartRef2} />
    </Fragment>
  );
};
