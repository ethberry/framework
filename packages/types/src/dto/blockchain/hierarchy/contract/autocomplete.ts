import type { TokenType } from "@gemunion/types-blockchain";

import { ContractFeatures, ContractStatus, ModuleType } from "../../../../entities";

export interface IContractAutocompleteDto {
  contractStatus: Array<ContractStatus>;
  contractType: Array<TokenType>;
  contractFeatures: Array<ContractFeatures>;
  contractModule: Array<ModuleType>;

  // I do not like this
  excludeFeatures: Array<ContractFeatures>;

  chainId: number;
  merchantId: number;
}
