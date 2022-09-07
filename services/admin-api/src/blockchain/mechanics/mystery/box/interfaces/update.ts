import { IAssetDto, MysteryboxStatus } from "@framework/types";

export interface IMysteryboxUpdateDto {
  title: string;
  description: string;
  item: IAssetDto;
  price: IAssetDto;
  imageUrl: string;
  mysteryboxStatus: MysteryboxStatus;
}
