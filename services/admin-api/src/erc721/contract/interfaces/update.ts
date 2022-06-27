import { UniContractStatus } from "@framework/types";

export interface IErc721CollectionUpdateDto {
  title: string;
  description: string;
  imageUrl: string;
  contractStatus: UniContractStatus;
}
