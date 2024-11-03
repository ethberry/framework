import { useLayoutEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import functionPlot from "function-plot";

import { IVestingBox } from "@framework/types";

import { Time } from "./types";
import { defaultValues, plotDataByShape, timeValues } from "./constants";
import { IPlotConfig } from "./types";

export const useRenderPlot = () => {
  const form = useFormContext<IVestingBox>();
  const valuesForPlotConfig = form.watch();

  const options = useMemo(() => {
    const { shape, cliff, duration, period, afterCliffBasisPoints, growthRate } = {
      ...defaultValues,
      ...valuesForPlotConfig,
    };
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
      growthRate: growthRate || defaultValues.growthRate,
    };

    return {
      xDomainLimit: durationInDays + cliffInDays,
      yDomainLimit: 100,
      functionType: shape.split("_")[0],
      cliff: cliff || 0,
      duration,
      period: period || 1,
      afterCliffBasisPoints: afterCliffBasisPoints || 0,
      data: plotDataByShape[shape](config),
    };
  }, [valuesForPlotConfig]);

  useLayoutEffect(() => {
    const functionPlotBox = document.getElementById("#function-plot");

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
      height: functionPlotBox?.offsetHeight || 200,
    });
  }, [options]);
};
