import { ModuleType, TokenType } from "../../../../entities";

export interface IBalanceAutocompleteDto {
  contractType: Array<TokenType>;
  contractModule: Array<ModuleType>;
  contractIds: Array<number>;
  tokenIds: Array<number>;
}
