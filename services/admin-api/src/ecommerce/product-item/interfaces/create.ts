import { IAssetDto, IPhoto } from "@framework/types";

export interface IProductItemCreateDto {
  amount: number;
  productId: number;
  price: IAssetDto;
  minQuantity: number;
  sku: string;
  photo: IPhoto;
  weight: number;
}
