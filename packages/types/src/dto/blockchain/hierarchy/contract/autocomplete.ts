import { ContractStatus, ContractFeatures, ModuleType, TokenType } from "../../../../entities";

export interface IContractAutocompleteDto {
  contractStatus: Array<ContractStatus>;
  contractType: Array<TokenType>;
  contractFeatures: Array<ContractFeatures>;
  contractModule: Array<ModuleType>;
}
