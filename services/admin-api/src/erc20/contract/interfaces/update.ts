import { UniContractStatus } from "@framework/types";

export interface IErc20ContractUpdateDto {
  title: string;
  description: string;
  contractStatus: UniContractStatus;
}
