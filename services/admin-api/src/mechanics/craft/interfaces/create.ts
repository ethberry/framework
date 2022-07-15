import { IAssetDto } from "../../asset/interfaces";

export interface ICraftCreateDto {
  item: IAssetDto;
  ingredients: IAssetDto;
}
