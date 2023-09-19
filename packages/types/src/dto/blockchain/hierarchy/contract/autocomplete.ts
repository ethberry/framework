import type { TokenType } from "@gemunion/types-blockchain";

import { ContractFeatures, ContractStatus, ModuleType } from "../../../../entities";

export interface IContractAutocompleteDto {
  contractStatus: Array<ContractStatus>;
  contractType: Array<TokenType>;
  contractFeatures: Array<ContractFeatures>;
  contractModule: Array<ModuleType>;

  // this is here to support soulbound tokens
  excludeFeatures: Array<ContractFeatures>;
  // BUSINESS_TYPE=B2B
  // this is here to support external tokens
  includeExternalContracts: boolean;

  chainId: number;
  merchantId: number;
}
