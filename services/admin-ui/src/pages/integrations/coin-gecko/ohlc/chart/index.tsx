import { FC, Fragment, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import * as Plot from "@observablehq/plot";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";

import { BaseCoins, TargetCoins } from "../../rates/enums";

interface IOhlcResult {
  date: number;
  open: number;
  low: number;
  high: number;
  close: number;
}

const transformOhlc = (rows: number[][]): IOhlcResult[] => {
  const result: IOhlcResult[] = [];

  rows.forEach(([date, open, low, high, close]: number[]) =>
    result.push({
      date,
      open,
      low,
      high,
      close,
    }),
  );

  return result;
};

export const OhlcChart: FC = () => {
  const [rows, setRows] = useState<Array<any>>([]);

  const { fn, isLoading } = useApiCall(
    api => {
      return api
        .fetchJson({
          url: "/coin-gecko/ohlc",
          method: "GET",
          data: {
            baseCoinId: BaseCoins.ETHEREUM,
            targetCoinId: TargetCoins.USD,
            days: 365,
          },
        })
        .then(json => {
          setRows(transformOhlc(json));
        });
    },
    { success: false },
  );

  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rows.length && !isLoading) {
      void fn();
    }

    if (rows.length && chartRef.current) {
      const width = chartRef.current.clientWidth;
      const height = 400;

      const chart = Plot.plot({
        grid: true,
        height,
        width,
        style: {
          background: "inherit",
        },
        y: {
          label: "↑ Stock price ($)",
          line: true,
          nice: true,
        },
        x: {
          type: "utc",
          line: true,
          nice: true,
        },
        color: {
          domain: [-1, 0, 1],
          range: ["#e41a1c", "#000000", "#4daf4a"],
        },
        marks: [
          Plot.ruleY(
            rows,
            Plot.selectFirst({
              y: (d: IOhlcResult) => d.open,
              stroke: "grey",
              strokeDasharray: "3,2",
            }),
          ),
          Plot.ruleX(rows, {
            x: "date",
            y1: "low",
            y2: "high",
          }),
          Plot.ruleX(rows, {
            x: "date",
            y1: "open",
            y2: "close",
            stroke: (d: IOhlcResult) => Math.sign(d.close - d.open),
            strokeWidth: 4,
            strokeLinecap: "round",
          }),
        ],
      });

      while (chartRef.current.lastChild) {
        chartRef.current.removeChild(chartRef.current.lastChild);
      }

      chartRef.current.append(chart);
    }
  }, [chartRef.current, rows]);

  return (
    <Fragment>
      <ProgressOverlay isLoading={isLoading}>
        <Box mt={4} width="100%" ref={chartRef} overflow="visible" />
      </ProgressOverlay>
    </Fragment>
  );
};
