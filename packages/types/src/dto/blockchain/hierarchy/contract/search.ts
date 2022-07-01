import { ISearchDto } from "@gemunion/types-collection";
import { ContractRole, ContractStatus, ContractTemplate } from "../../../../entities";

export interface IContractSearchDto extends ISearchDto {
  contractStatus: Array<ContractStatus>;
  contractTemplate: Array<ContractTemplate>;
  contractRole: Array<ContractRole>;
}
