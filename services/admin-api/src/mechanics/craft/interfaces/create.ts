import { IAssetDto } from "../../asset/interfaces";

export interface ICraftCreateDto {
  item: IAssetDto;
  price: IAssetDto;
}
