import type { TokenType } from "@ethberry/types-blockchain";

import { ContractFeatures, ModuleType, TemplateStatus } from "../../../../entities";

export interface ITemplateAutocompleteDto {
  templateStatus: Array<TemplateStatus>;
  contractType: Array<TokenType>;
  contractFeatures: Array<ContractFeatures>;
  contractModule: Array<ModuleType>;
  contractIds: Array<number>;

  chainId: number;
  merchantId: number;
}
