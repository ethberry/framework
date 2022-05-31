import { ContractType } from "@framework/types";

export interface IContractManagerCreateDto {
  address: string;
  fromBlock: number;
  contractType: ContractType;
}
