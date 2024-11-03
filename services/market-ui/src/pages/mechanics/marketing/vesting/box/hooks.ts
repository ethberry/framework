import { useLayoutEffect, useRef } from "react";
import functionPlot from "function-plot";

import { IVestingBox, ShapeType } from "@framework/types";
import { Time, IPlotConfig } from "./content/types";
import { plotDataByShape, timeValues } from "./constants";

type BoxValues = Partial<
  Pick<IVestingBox, "shape" | "cliff" | "duration" | "period" | "afterCliffBasisPoints" | "growthRate">
>;

export const useRenderPlot = (boxValues: BoxValues) => {
  const plotRef = useRef<HTMLElement | null>(null);
  const {
    shape = ShapeType.LINEAR,
    cliff = 0,
    duration = timeValues[Time.YEAR],
    period = 1,
    afterCliffBasisPoints = 0,
    growthRate = 1,
  } = boxValues;

  const durationInDays = duration / 86400;
  const cliffInDays = cliff / 86400;
  const periodInDays = period ? period / 86400 : timeValues[Time.ONE_DAY] / 86400;
  const immediateUnlockPercentage = afterCliffBasisPoints / 100;
  const immediateUnlockPercentageRestPercent = immediateUnlockPercentage ? 100 - immediateUnlockPercentage : 0;

  const config: IPlotConfig = {
    duration: durationInDays + cliffInDays,
    cliff: cliffInDays,
    period: periodInDays,
    immediateUnlockPercentage,
    immediateUnlockPercentageRestPercent,
    afterCliffBasisPoints,
    growthRate,
  };

  const options = {
    xDomainLimit: durationInDays + cliffInDays,
    yDomainLimit: 100,
    functionType: shape.split("_")[0],
    cliff: cliff || 0,
    duration,
    period: period || 1,
    afterCliffBasisPoints: afterCliffBasisPoints || 0,
    data: plotDataByShape[shape](config),
  };

  useLayoutEffect(() => {
    const functionPlotBox = plotRef.current;

    functionPlot({
      ...options,
      target: "#function-plot",
      disableZoom: true,
      grid: true,
      xAxis: {
        domain: [0, options.xDomainLimit || 100],
        label: "Days",
      },
      yAxis: { domain: [0, options.yDomainLimit || 100], label: "% Tokens" },
      data: options.data,
      width: functionPlotBox?.offsetWidth || 400,
      height: 400,
    });
  }, [options]);

  return { plotRef };
};
