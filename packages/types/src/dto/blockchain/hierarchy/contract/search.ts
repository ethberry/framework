import type { ISearchDto } from "@gemunion/types-collection";

import { ContractFeatures, ContractStatus, ModuleType } from "../../../../entities";
import { TokenType } from "../../../../index";

export interface IContractSearchDto extends ISearchDto {
  contractStatus: Array<ContractStatus>;
  contractFeatures: Array<ContractFeatures>;
  contractType: Array<TokenType>;
  contractModule: Array<ModuleType>;
}
