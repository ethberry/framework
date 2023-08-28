import { IAssetDto } from "@framework/types";

export interface IDismantleCreateDto {
  item: IAssetDto;
  price: IAssetDto;
}
