import { Erc1155CollectionStatus } from "@framework/types";

export interface IErc1155CollectionUpdateDto {
  title: string;
  description: string;
  imageUrl: string;
  collectionStatus: Erc1155CollectionStatus;
}
