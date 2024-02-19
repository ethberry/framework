import { FC, Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
import * as Plot from "@observablehq/plot";
import { utils } from "ethers";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { InputType } from "@gemunion/types-collection";
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
      contractId: InputType.awaited,
      deposit: {
        tokenType: TokenType.ERC20,
        contractId: InputType.awaited,
      },
      reward: {
        tokenType: TokenType.ERC721,
        contractId: InputType.awaited,
      },
      emptyReward: false,
      startTimestamp: startOfMonth(subMonths(new Date(), 1)).toISOString(),
      endTimestamp: endOfMonth(addMonths(new Date(), 1)).toISOString(),
    },
  });

  const chartRef = useRef<HTMLDivElement>(null);
  const [recentDeposits, setRecentDeposits] = useState(false);

  const handleSwitchDeposit = () => {
    setRecentDeposits(value => !value);
  };

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
      const height = 440;

      const chart = Plot.plot({
        width: Math.min(width, 900),
        height,
        marginLeft: 70,
        marginRight: 50,
        marginBottom: 60,
        style: {
          background: "inherit",
        },
        y: {
          axis: "left",
          grid: true,
          label: "Count",
          nice: true,
          line: true,
          labelAnchor: "top",
          labelOffset: 40,
          transform: (d: string) => Number(d || 0),
        },
        x: {
          label: "Date",
          type: "band",
          line: true,
          nice: true,
          thresholds: 1,
          labelAnchor: "center",
          transform: (d: string) => new Date(d),
          labelOffset: 60,
          tickRotate: -45,
          tickFormat: "%m/%d",
        },
        marks: [
          Plot.barY(rows, {
            y: recentDeposits ? "new_deposit_count" : "current_deposit_count",
            x: "start_date",
            fill: "#ccc",
          }),
          () =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            Plot.plot({
              width: Math.min(width, 900),
              height,
              marginLeft: 70,
              marginRight: 50,
              marginBottom: 60,
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
                label: "Amount",
                line: true,
                nice: true,
                transform: (d: string | null) => (d ? Number(utils.formatUnits(d, 18)) : 0),
                tickFormat: (d: string) => `Ξ ${d}`,
              },
              marks: [
                Plot.line(rows, {
                  y: recentDeposits ? "new_deposit_amount" : "current_deposit_amount",
                  x: "start_date",
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
  }, [recentDeposits, chartRef.current, rows]);

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "staking", "staking.chart"]} />

      <PageHeader message="pages.staking.chart.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <StakingChartSearchForm
        recentDeposits={recentDeposits}
        handleSwitchDeposit={handleSwitchDeposit}
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
      />

      <ProgressOverlay isLoading={isLoading}>
        <Box sx={{ mt: 4, mb: 2 }} width="100%" ref={chartRef} />
      </ProgressOverlay>
    </Fragment>
  );
};
