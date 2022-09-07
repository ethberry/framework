import { ContractFeatures, ModuleType, TemplateStatus, TokenType } from "../../../../entities";

export interface ITemplateAutocompleteDto {
  templateStatus: Array<TemplateStatus>;
  contractType: Array<TokenType>;
  contractFeatures: Array<ContractFeatures>;
  contractModule: Array<ModuleType>;
  contractIds: Array<number>;
}
