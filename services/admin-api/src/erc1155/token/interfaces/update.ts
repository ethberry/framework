import { Erc1155TokenStatus } from "@framework/types";

export interface IErc1155TokenUpdateDto {
  title: string;
  description: string;
  attributes: string;
  imageUrl: string;
  price: string;
  tokenStatus: Erc1155TokenStatus;
}
