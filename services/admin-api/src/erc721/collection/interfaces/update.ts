import { Erc721CollectionStatus } from "@framework/types";

export interface IErc721CollectionUpdateDto {
  title: string;
  description: string;
  imageUrl: string;
  collectionStatus: Erc721CollectionStatus;
}
