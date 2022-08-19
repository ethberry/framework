import { TemplateStatus, TokenType } from "../../../../entities";

export interface ITemplateAutocompleteDto {
  templateStatus: Array<TemplateStatus>;
  contractType: Array<TokenType>;
  contractIds: Array<number>;
}
