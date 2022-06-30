import { UniContractStatus, UniContractRole, TokenType, UniContractTemplate } from "../../../entities";

export interface IUniContractAutocompleteDto {
  contractStatus: Array<UniContractStatus>;
  contractRole: Array<UniContractRole>;
  contractTemplate: Array<UniContractTemplate>;
  contractType: Array<TokenType>;
}
