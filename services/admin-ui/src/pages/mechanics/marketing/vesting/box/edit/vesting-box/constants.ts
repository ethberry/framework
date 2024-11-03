import { FunctionPlotDatum } from "function-plot";

import { ShapeType } from "@framework/types";

import { Time, IPlotConfig } from "./types";
import { IOption } from "./select";
import { generateSteppedData } from "./utils";

export const defaultValues = {
  cliff: 0,
  growthRate: 100,
  afterCliffBasisPoints: 0,
};

export const timeValues: {
  [Key in Time]: number;
} = {
  [Time.ONE_DAY]: 86400,
  [Time.TWO_DAYS]: 172800,
  [Time.SEVEN_DAYS]: 604800,
  [Time.MONTH]: 2592000,
  [Time.THREE_MONTH]: 7776000,
  [Time.SIX_MONTH]: 15552000,
  [Time.YEAR]: 31557600,
  [Time.TWO_YEARS]: 63115200,
};

export const cliffOptions: Array<IOption<number>> = [
  {
    title: Time.ONE_DAY,
    value: timeValues[Time.ONE_DAY],
  },
  {
    title: Time.TWO_DAYS,
    value: timeValues[Time.TWO_DAYS],
  },
  {
    title: Time.SEVEN_DAYS,
    value: timeValues[Time.SEVEN_DAYS],
  },
  {
    title: Time.MONTH,
    value: timeValues[Time.MONTH],
  },
  {
    title: Time.SIX_MONTH,
    value: timeValues[Time.SIX_MONTH],
  },
  {
    title: Time.YEAR,
    value: timeValues[Time.YEAR],
  },
];

export const periodOptions: Array<IOption<number>> = [
  {
    title: Time.ONE_DAY,
    value: timeValues[Time.ONE_DAY],
  },
  {
    title: Time.SEVEN_DAYS,
    value: timeValues[Time.SEVEN_DAYS],
  },
  {
    title: Time.MONTH,
    value: timeValues[Time.MONTH],
  },
  {
    title: Time.THREE_MONTH,
    value: timeValues[Time.THREE_MONTH],
  },
  {
    title: Time.SIX_MONTH,
    value: timeValues[Time.SIX_MONTH],
  },
];

export const durationOptions: Array<IOption<number>> = [
  {
    title: Time.MONTH,
    value: timeValues[Time.MONTH],
  },
  {
    title: Time.THREE_MONTH,
    value: timeValues[Time.THREE_MONTH],
  },
  {
    title: Time.SIX_MONTH,
    value: timeValues[Time.SIX_MONTH],
  },
  {
    title: Time.YEAR,
    value: timeValues[Time.YEAR],
  },
  {
    title: Time.TWO_YEARS,
    value: timeValues[Time.TWO_YEARS],
  },
];

export const plotDataByShape: {
  [Key in ShapeType]: (config: IPlotConfig) => Array<FunctionPlotDatum>;
} = {
  [ShapeType.LINEAR]: ({ duration }) => [{ fn: `x / ${duration} * 100`, color: "#f77423" }],
  [ShapeType.LINEAR_CLIFF]: ({ duration, cliff }) => [
    { fn: "0", range: [0, cliff], color: "#f77423" },
    { fn: `(x - ${cliff}) / (${duration} - ${cliff}) * 100`, range: [cliff, duration], color: "#f77423" },
  ],
  [ShapeType.LINEAR_IMMEDIATE]: ({ duration, immediateUnlockPercentage, immediateUnlockPercentageRestPercent }) => [
    {
      fn: `${immediateUnlockPercentage} + (x / ${duration}) * ${immediateUnlockPercentageRestPercent}`,
      color: "#f77423",
    },
  ],
  [ShapeType.LINEAR_CLIFF_IMMEDIATE]: ({
    duration,
    cliff,
    immediateUnlockPercentage,
    immediateUnlockPercentageRestPercent,
  }) => [
    { fn: "0", range: [0, cliff], color: "#f77423" },
    {
      fn: `(x - ${cliff}) / (${duration} - ${cliff}) * ${immediateUnlockPercentageRestPercent} + ${immediateUnlockPercentage}`,
      range: [cliff, duration],
      color: "#f77423",
    },
    {
      points: [
        [cliff, 0],
        [cliff, immediateUnlockPercentage],
      ],
      fnType: "points",
      graphType: "polyline",
      color: "#f77423",
    },
  ],
  [ShapeType.LINEAR_STEPS]: config => [
    {
      points: generateSteppedData(config),
      fnType: "points",
      graphType: "polyline",
      color: "#65a3ff",
    },
  ],
  [ShapeType.EXPONENTIAL]: ({ duration, growthRate }) => [
    { fn: `nthRoot((x / ${duration}) ^ ${growthRate}, 100) * 100`, color: "#f77423" },
  ],
  [ShapeType.EXPONENTIAL_CLIFF]: ({ duration, cliff, growthRate }) => [
    { fn: "0", range: [0, cliff], color: "#f77423" },
    {
      fn: `nthRoot(((x - ${cliff}) / (${duration} - ${cliff}))^${growthRate}, 100) * 100`,
      range: [cliff, duration],
      color: "#f77423",
    },
  ],
  [ShapeType.EXPONENTIAL_IMMEDIATE]: ({
    duration,
    immediateUnlockPercentage,
    immediateUnlockPercentageRestPercent,
    growthRate,
  }) => [
    {
      fn: `${immediateUnlockPercentage} + nthRoot((x / ${duration})^${growthRate}, 100) * ${immediateUnlockPercentageRestPercent}`,
      color: "#f77423",
    },
  ],
  [ShapeType.EXPONENTIAL_CLIFF_IMMEDIATE]: ({
    duration,
    cliff,
    growthRate,
    immediateUnlockPercentage,
    immediateUnlockPercentageRestPercent,
  }) => [
    { fn: "0", range: [0, cliff], color: "#65a3ff" },
    {
      fn: `${immediateUnlockPercentage} + nthRoot(((x - ${cliff}) / (${duration} - ${cliff}))^${growthRate}, 100) * ${immediateUnlockPercentageRestPercent}`,
      range: [cliff, duration],
      color: "#65a3ff",
    },
    {
      points: [
        [cliff, 0],
        [cliff, immediateUnlockPercentage],
      ],
      fnType: "points",
      graphType: "polyline",
      color: "#65a3ff",
    },
  ],
  [ShapeType.HYPERBOLIC]: ({ duration }) => [
    { fn: `(x / ${duration}) / (x / ${duration} + 1) * 100 * 2`, color: "#f77423" },
  ],
  [ShapeType.HYPERBOLIC_CLIFF]: ({ duration, cliff }) => [
    { fn: "0", range: [0, cliff], color: "#65a3ff" },
    {
      fn: `((x - ${cliff}) / (${duration} - ${cliff})) / ((x - ${cliff}) / (${duration} - ${cliff}) + 1) * 100 * 2`,
      range: [cliff, duration],
      color: "#65a3ff",
    },
  ],
  [ShapeType.HYPERBOLIC_IMMEDIATE]: ({ duration, immediateUnlockPercentage, immediateUnlockPercentageRestPercent }) => [
    {
      fn: `${immediateUnlockPercentage} + (x / ${duration}) / (x / ${duration} + 1) * ${immediateUnlockPercentageRestPercent} * 2`,
      color: "#65a3ff",
    },
  ],
  [ShapeType.HYPERBOLIC_CLIFF_IMMEDIATE]: ({ duration, cliff, immediateUnlockPercentage }) => [
    { fn: "0", range: [0, cliff], color: "#65a3ff" },
    {
      fn: `${immediateUnlockPercentage} + ((x - ${cliff}) / (${duration} - ${cliff})) / ((x - ${cliff}) / (${duration} - ${cliff}) + 1) * (100 - ${immediateUnlockPercentage}) * 2`,
      range: [cliff, duration],
      color: "#65a3ff",
    },
    {
      points: [
        [cliff, 0],
        [cliff, immediateUnlockPercentage],
      ],
      fnType: "points",
      graphType: "polyline",
      color: "#65a3ff",
    },
  ],
};

export const growthRateShapes = [
  ShapeType.EXPONENTIAL_CLIFF,
  ShapeType.EXPONENTIAL,
  ShapeType.EXPONENTIAL_IMMEDIATE,
  ShapeType.EXPONENTIAL_CLIFF_IMMEDIATE,
];

export const cliffShapes = [
  ShapeType.LINEAR_CLIFF,
  ShapeType.LINEAR_CLIFF_IMMEDIATE,
  ShapeType.EXPONENTIAL_CLIFF,
  ShapeType.EXPONENTIAL_CLIFF_IMMEDIATE,
  ShapeType.HYPERBOLIC_CLIFF,
  ShapeType.HYPERBOLIC_CLIFF_IMMEDIATE,
];

export const immediateShapes = [
  ShapeType.LINEAR_IMMEDIATE,
  ShapeType.EXPONENTIAL_IMMEDIATE,
  ShapeType.HYPERBOLIC_IMMEDIATE,
];
export const afterCliffBasisPointsShapes = immediateShapes.concat([
  ShapeType.LINEAR_CLIFF_IMMEDIATE,
  ShapeType.EXPONENTIAL_CLIFF_IMMEDIATE,
  ShapeType.HYPERBOLIC_CLIFF_IMMEDIATE,
]);

export const periodShapes = [ShapeType.LINEAR_STEPS];
