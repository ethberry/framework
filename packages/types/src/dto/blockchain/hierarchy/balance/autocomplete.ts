import type { TokenType } from "@ethberry/types-blockchain";

import { ModuleType } from "../../../../entities";

export interface IBalanceAutocompleteDto {
  contractType: Array<TokenType>;
  contractModule: Array<ModuleType>;
  contractIds: Array<number>;
  tokenIds: Array<number>;
}
