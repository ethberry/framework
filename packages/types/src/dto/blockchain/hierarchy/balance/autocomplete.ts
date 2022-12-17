import type { TokenType } from "@gemunion/types-blockchain";

import { ModuleType } from "../../../../entities";

export interface IBalanceAutocompleteDto {
  contractType: Array<TokenType>;
  contractModule: Array<ModuleType>;
  contractIds: Array<number>;
  tokenIds: Array<number>;
}
