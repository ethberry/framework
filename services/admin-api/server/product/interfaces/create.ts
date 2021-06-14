import {IPhoto} from "@trejgun/solo-types";

export interface IProductCreateDto {
  title: string;
  description: string;
  price: number;
  amount: number;
  merchantId?: number;
  photos: Array<IPhoto>;
}
