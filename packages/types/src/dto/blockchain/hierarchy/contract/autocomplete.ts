import { ContractStatus, ContractFeatures, ModuleType, TokenType } from "../../../../entities";

export interface IContractAutocompleteDto {
  contractStatus: Array<ContractStatus>;
  contractFeatures: Array<ContractFeatures>;
  contractType: Array<TokenType>;
  contractModule: Array<ModuleType>;
}
