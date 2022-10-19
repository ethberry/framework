import type { ISearchDto } from "@gemunion/types-collection";
import { ContractFeatures, ContractStatus } from "../../../../entities";

export interface IContractSearchDto extends ISearchDto {
  contractStatus: Array<ContractStatus>;
  contractFeatures: Array<ContractFeatures>;
}
