import { UniContractStatus, UniContractRole } from "../../../entities";

export interface IErc721ContractAutocompleteDto {
  contractStatus: Array<UniContractStatus>;
  contractRole: Array<UniContractRole>;
}
