import { DurationUnit, IAssetDto } from "@framework/types";

export interface IPonziUpdateDto {
  title: string;
  description: string;
  deposit: IAssetDto;
  reward: IAssetDto;
  durationAmount: number;
  durationUnit: DurationUnit;
  penalty: number;
  recurrent: boolean;
}
