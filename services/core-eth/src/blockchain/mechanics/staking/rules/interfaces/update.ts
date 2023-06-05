import { DurationUnit, IAssetDto } from "@framework/types";

export interface IStakingUpdateDto {
  title: string;
  description: string;
  deposit: IAssetDto;
  reward: IAssetDto;
  durationAmount: number;
  durationUnit: DurationUnit;
  penalty: number;
  maxStake: number;
  recurrent: boolean;
}
