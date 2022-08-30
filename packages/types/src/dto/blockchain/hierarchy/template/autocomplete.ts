import { ContractFeatures, TemplateStatus, TokenType } from "../../../../entities";

export interface ITemplateAutocompleteDto {
  templateStatus: Array<TemplateStatus>;
  contractType: Array<TokenType>;
  contractFeatures: Array<ContractFeatures>;
  contractIds: Array<number>;
}
