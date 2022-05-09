export interface IErc1155TokenCreateDto {
  title: string;
  description: string;
  attributes: string;
  imageUrl: string;
  price: string;
  amount: number;
  erc1155CollectionId: number;
}
