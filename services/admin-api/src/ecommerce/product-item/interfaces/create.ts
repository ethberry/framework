import { IAssetDto, IPhoto } from "@framework/types";

export interface IProductItemCreateDto {
  productId: number;
  price: IAssetDto;
  priceId: number;
  minQuantity: number;
  maxQuantity: number;
  sku: string;
  photo: IPhoto;
}
