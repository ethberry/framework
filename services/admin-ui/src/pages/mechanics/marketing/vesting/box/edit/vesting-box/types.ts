export interface IPlotConfig {
  duration: number;
  cliff: number;
  period: number;
  afterCliffBasisPoints: number;
  immediateUnlockPercentage: number;
  immediateUnlockPercentageRestPercent: number;
  growthRate: number;
}

export enum Time {
  ONE_DAY = "ONE_DAY",
  TWO_DAYS = "TWO_DAYS",
  SEVEN_DAYS = "SEVEN_DAYS",
  MONTH = "MONTH",
  THREE_MONTH = "THREE_MONTH",
  SIX_MONTH = "SIX_MONTH",
  YEAR = "YEAR",
  TWO_YEARS = "TWO_YEARS",
}
