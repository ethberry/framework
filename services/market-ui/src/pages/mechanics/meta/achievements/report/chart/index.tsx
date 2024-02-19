import { FC, useEffect, useRef } from "react";
import { Box, useTheme } from "@mui/material";

import { IAchievementItemReport, IAchievementRule } from "@framework/types";

import { DonutChart } from "./chart";

export interface IReportChartProps {
  count: IAchievementItemReport;
  achievementRule: IAchievementRule;
}

export const ReportChart: FC<IReportChartProps> = props => {
  const { count = { count: 0 }, achievementRule } = props;
  const theme = useTheme();
  const chartRef = useRef<HTMLDivElement | null>(null);

  const maxLevel = achievementRule.levels.reverse().reduce((foundLevel, nextLevel) => {
    if (nextLevel.amount > count.count && nextLevel.id > foundLevel.id) {
      return nextLevel;
    }
    return foundLevel;
  }, achievementRule.levels[0]);

  const done = Math.ceil((100 * count.count) / maxLevel?.amount);
  const rest = done > 100 ? 0 : 100 - done;

  useEffect(() => {
    if (chartRef.current) {
      const chart = DonutChart({
        data: [
          ["done", done],
          ["rest", rest],
        ],
        // level: achievementRule.levels.findIndex(({ id }) => level.id === id) + 1,
        level: maxLevel.achievementLevel,
        score: `${count.count} / ${maxLevel?.amount}`,
        colors: [theme.palette.primary.main, "#BDBDBD"],
      });

      while (chartRef.current.lastChild) {
        chartRef.current.removeChild(chartRef.current.lastChild);
      }

      chartRef.current.append(chart);
    }
  }, [chartRef.current]);

  return <Box ref={chartRef} />;
};
