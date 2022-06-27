import { UniContractStatus, UniContractType } from "../../../entities";

export interface IErc998CollectionAutocompleteDto {
  contractStatus: Array<UniContractStatus>;
  contractType: Array<UniContractType>;
}
