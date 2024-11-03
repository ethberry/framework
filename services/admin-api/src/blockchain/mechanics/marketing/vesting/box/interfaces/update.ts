import { IAssetDto, VestingBoxStatus } from "@framework/types";

export interface IVestingBoxUpdateDto {
  title: string;
  description: string;
  content: IAssetDto;
  price: IAssetDto;
  imageUrl: string;
  vestingBoxStatus: VestingBoxStatus;
}
