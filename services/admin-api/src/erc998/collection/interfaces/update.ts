import { Erc998CollectionStatus } from "@framework/types";

export interface IErc998CollectionUpdateDto {
  title: string;
  description: string;
  imageUrl: string;
  collectionStatus: Erc998CollectionStatus;
}
