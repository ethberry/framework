import { UniContractStatus, UniContractType } from "../../../entities";

export interface IErc721ContractAutocompleteDto {
  contractStatus: Array<UniContractStatus>;
  contractType: Array<UniContractType>;
}
