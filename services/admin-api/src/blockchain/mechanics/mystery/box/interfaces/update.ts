import { IAssetDto, MysteryboxStatus } from "@framework/types";

export interface IMysteryBoxUpdateDto {
  title: string;
  description: string;
  item: IAssetDto;
  price: IAssetDto;
  imageUrl: string;
  mysteryboxStatus: MysteryboxStatus;
}
