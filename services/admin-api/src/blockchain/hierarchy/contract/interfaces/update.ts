import { ContractStatus } from "@framework/types";

export interface IContractUpdateDto {
  title: string;
  description: string;
  imageUrl: string;
  contractStatus: ContractStatus;
}
