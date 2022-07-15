import { ContractStatus, TokenType, ContractTemplate } from "../../../../entities";

export interface IContractAutocompleteDto {
  contractStatus: Array<ContractStatus>;
  contractTemplate: Array<ContractTemplate>;
  contractType: Array<TokenType>;
}
