import { Erc1155TokenStatus } from "@framework/types";

export interface IErc1155TokenUpdateDto {
  title: string;
  description: string;
  attributes: string;
  imageUrl: string;
  price: string;
  amount: number;
  tokenStatus: Erc1155TokenStatus;
}
