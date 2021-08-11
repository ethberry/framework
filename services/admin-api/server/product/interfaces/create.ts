import { IPhoto } from "@gemunionstudio/framework-types";

export interface IProductCreateDto {
  title: string;
  description: string;
  categoryIds: Array<number>;
  price: number;
  amount: number;
  merchantId?: number;
  photos: Array<IPhoto>;
}
