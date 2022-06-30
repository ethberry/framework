import { ContractStatus, ContractRole, TokenType, ContractTemplate } from "../../../entities";

export interface IContractAutocompleteDto {
  contractStatus: Array<ContractStatus>;
  contractRole: Array<ContractRole>;
  contractTemplate: Array<ContractTemplate>;
  contractType: Array<TokenType>;
}
