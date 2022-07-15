import { ISearchDto } from "@gemunion/types-collection";
import { ContractStatus, ContractTemplate } from "../../../../entities";

export interface IContractSearchDto extends ISearchDto {
  contractStatus: Array<ContractStatus>;
  contractTemplate: Array<ContractTemplate>;
}
