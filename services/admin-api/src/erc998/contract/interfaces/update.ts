import { UniContractStatus } from "@framework/types";

export interface IErc998CollectionUpdateDto {
  title: string;
  description: string;
  imageUrl: string;
  contractStatus: UniContractStatus;
}
