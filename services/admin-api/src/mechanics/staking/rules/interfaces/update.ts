import { IAssetDto } from "@framework/types";

export interface IStakingUpdateDto {
  title: string;
  description: string;
  deposit: IAssetDto;
  reward: IAssetDto;
  duration: number;
  penalty: number;
  recurrent: boolean;
}
