import { UniContractStatus } from "@framework/types";

export interface IUniContractUpdateDto {
  title: string;
  description: string;
  imageUrl: string;
  contractStatus: UniContractStatus;
}
