import { IAssetDto, LootBoxStatus } from "@framework/types";

export interface ILootBoxUpdateDto {
  title: string;
  description: string;
  item: IAssetDto;
  price: IAssetDto;
  imageUrl: string;
  lootBoxStatus: LootBoxStatus;
  min: number;
  max: number;
}
