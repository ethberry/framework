import { ContractStatus, ContractTemplate, ModuleType, TokenType } from "../../../../entities";

export interface IContractAutocompleteDto {
  contractStatus: Array<ContractStatus>;
  contractTemplate: Array<ContractTemplate>;
  contractType: Array<TokenType>;
  contractModule: Array<ModuleType>;
}
