import { ContractStatus, Erc20ContractTemplate } from "../../../entities";

export interface IErc20ContractAutocompleteDto {
  contractStatus: Array<ContractStatus>;
  contractTemplate: Array<Erc20ContractTemplate>;
}
