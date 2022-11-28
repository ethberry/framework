import { DurationUnit, IAssetDto } from "@framework/types";

export interface IPyramidUpdateDto {
  title: string;
  description: string;
  deposit: IAssetDto;
  reward: IAssetDto;
  durationAmount: number;
  durationUnit: DurationUnit;
  penalty: number;
  maxCycles: number;
  recurrent: boolean;
}
