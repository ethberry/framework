import { FC } from "react";
import { formatDistanceToNowStrict, addSeconds, format, fromUnixTime } from "date-fns";
import { SvgIconProps } from "@mui/material";

import { Arbitrum, Besu, Binance, Ethereum, Optimism, Polygon, ImmutableZkEVM, Telos } from "@ethberry/mui-icons";
import { IPlotConfig } from "./types";

export const sizeDecreaseCalc = (maxSize: number, minSize: number, unit?: "px" | "%" | "deg") => {
  return `calc(${minSize}${unit || "px"} + (${maxSize} - ${minSize}) * ((100vw - 320px) / (1200 - 320)))`;
};

export const sizeIncreaseCalc = (
  maxSize: number,
  minSize: number,
  maxWidth: number,
  minWidth: number,
  unit?: "px" | "%",
) => {
  return `calc(${minSize}${unit || "px"} + (${maxSize} - ${minSize}) * ((100vw - ${minWidth}px) / (${maxWidth} - ${minWidth})))`;
};

export const getIconByChainId = (chainId: number): FC<SvgIconProps> | null => {
  switch (chainId) {
    case 1:
    case 11155111:
      return Ethereum;
    case 10:
      return Optimism;
    case 56:
    case 97:
      return Binance;
    case 137:
    case 80002:
      return Polygon;
    case 42161:
      return Arbitrum;
    case 10000:
    case 10001:
      return Besu;
    case 13371:
    case 13473:
      return ImmutableZkEVM;
    case 40:
    case 41:
      return Telos;
    default:
      return null;
  }
};

export const generateSteppedData = (config: IPlotConfig) => {
  const { duration, period, afterCliffBasisPoints } = config;
  const immediateRelease = afterCliffBasisPoints / 10000;
  const steps = Math.floor(duration / period);
  const stepIncrement = (1 - immediateRelease) / steps;

  const data: Array<Array<number>> = [];
  for (let i = 0; i <= steps; i++) {
    const x = i * period;
    const y = immediateRelease + i * stepIncrement;
    // Add horizontal line for the step
    data.push([x, y * 100]);
    if (i < steps) {
      const nextX = (i + 1) * period;
      data.push([nextX, y * 100]);
    }
  }

  return data;
};

export const secondFromUnixConverter = (date: Date) => {
  const utcDateString = format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'");
  const utcDate = new Date(utcDateString);

  return utcDate.getTime() / 1000;
};

export const getPeriodFromSecondsInDays = (seconds: number): string => {
  const now = new Date();
  const targetDate = addSeconds(now, seconds);

  return formatDistanceToNowStrict(targetDate, { unit: "day" });
};

export const formatDateFromUnixTime = (unixSeconds: number, dateFormat: string): string => {
  const date = fromUnixTime(unixSeconds);

  return format(date, dateFormat);
};
