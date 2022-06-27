import { UniContractStatus, Erc20ContractTemplate } from "../../../entities";

export interface IErc20ContractAutocompleteDto {
  contractStatus: Array<UniContractStatus>;
  contractTemplate: Array<Erc20ContractTemplate>;
}
