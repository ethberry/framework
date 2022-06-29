import { UniContractStatus, UniContractRole } from "../../../entities";

export interface IErc998CollectionAutocompleteDto {
  contractStatus: Array<UniContractStatus>;
  contractRole: Array<UniContractRole>;
}
