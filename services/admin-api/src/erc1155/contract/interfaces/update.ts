import { UniContractStatus } from "@framework/types";

export interface IErc1155CollectionUpdateDto {
  title: string;
  description: string;
  imageUrl: string;
  contractStatus: UniContractStatus;
}
