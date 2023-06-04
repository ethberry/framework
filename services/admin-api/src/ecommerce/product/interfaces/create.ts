import { IPhoto } from "@framework/types";

export interface IProductCreateDto {
  title: string;
  description: string;
  categoryIds: Array<number>;
  photos: Array<IPhoto>;
  parameters: Array<any>;
  productItems: Array<any>;
}
