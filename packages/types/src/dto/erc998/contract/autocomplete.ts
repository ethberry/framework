import { ContractStatus, ContractRole } from "../../../entities";

export interface IErc998CollectionAutocompleteDto {
  contractStatus: Array<ContractStatus>;
  contractRole: Array<ContractRole>;
}
