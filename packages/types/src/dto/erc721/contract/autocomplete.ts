import { ContractStatus, ContractRole } from "../../../entities";

export interface IErc721ContractAutocompleteDto {
  contractStatus: Array<ContractStatus>;
  contractRole: Array<ContractRole>;
}
