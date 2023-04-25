import { IAssetDto, IPhoto } from "@framework/types";

export interface IProductCreateDto {
  title: string;
  description: string;
  categoryIds: Array<number>;
  price: IAssetDto;
  amount: number;
  merchantId?: number;
  photos: Array<IPhoto>;
  parameterIds: Array<number>;
}
