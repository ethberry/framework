import type { ISearchDto } from "@ethberry/types-collection";

import { ContractFeatures, ContractStatus } from "../../../../entities";

export interface IContractSearchDto extends ISearchDto {
  contractStatus?: Array<ContractStatus>;
  contractFeatures?: Array<ContractFeatures>;

  chainId: number;
  merchantId: number;
}
