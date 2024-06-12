import { IAssetDto, MysteryBoxStatus } from "@framework/types";

export interface IMysteryBoxUpdateDto {
  title: string;
  description: string;
  price: IAssetDto;
  imageUrl: string;
  mysteryBoxStatus: MysteryBoxStatus;
}
