import { FC, Fragment, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import * as Plot from "@observablehq/plot";

import { useApiCall } from "@gemunion/react-hooks";

interface IOhlcResult {
  date: number;
  open: number;
  low: number;
  high: number;
  close: number;
}

const transformOhlc = (rows: number[][]): IOhlcResult[] => {
  const result: IOhlcResult[] = [];

  rows.forEach((row: number[]) =>
    result.push({
      date: row[0],
      open: row[1],
      low: row[2],
      high: row[3],
      close: row[4],
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
            baseCoinId: "ethereum",
            targetCoinId: "usd",
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

    if (isLoading) {
      if (chartRef.current) {
        const width = chartRef.current.clientWidth;
        const height = 400;

        const chart = Plot.plot({
          grid: true,
          height,
          width,
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
    }
  }, [chartRef.current, rows]);

  return (
    <Fragment>
      <Box mt={4} width="100%" ref={chartRef} overflow="visible" />
    </Fragment>
  );
};
