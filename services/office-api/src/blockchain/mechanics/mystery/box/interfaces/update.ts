import { IAssetDto, MysteryBoxStatus } from "@framework/types";

export interface IMysteryBoxUpdateDto {
  title: string;
  description: string;
  item: IAssetDto;
  price: IAssetDto;
  imageUrl: string;
  mysteryBoxStatus: MysteryBoxStatus;
}
