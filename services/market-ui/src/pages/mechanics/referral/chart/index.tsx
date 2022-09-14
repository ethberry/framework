import { FC, Fragment, useEffect, useRef } from "react";
import { Box, Button } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
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
      startTimestamp: startOfMonth(subMonths(new Date(), 1)).toISOString(),
      endTimestamp: endOfMonth(addMonths(new Date(), 1)).toISOString(),
    },
  });

  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) {
      if (chartRef.current) {
        const width = chartRef.current.clientWidth;
        const height = 400;

        const chart = Plot.plot({
          width: Math.min(width, 780),
          height,
          marginLeft: 70,
          marginRight: 50,
          marginBottom: 40,
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
                  transform: (d: BigNumber) => BigNumber.from(d).div(1e15).toNumber(),
                },
                marks: [
                  Plot.line(rows, {
                    y: "amount",
                    x: "date",
                    curve: "catmull-rom",
                    marker: "circle",
                  }),
                ],
                color: {
                  scheme: "cool",
                },
              }),
          ],
          color: {
            scheme: "cool",
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

      <Box mt={4} width="100%" ref={chartRef} overflow="visible" />
    </Fragment>
  );
};
