import { ISearchDto } from "@gemunion/types-collection";
import { ContractStatus, ContractFeatures } from "../../../../entities";

export interface IContractSearchDto extends ISearchDto {
  contractStatus: Array<ContractStatus>;
  contractFeatures: Array<ContractFeatures>;
}
