import type { ISearchDto } from "@ethberry/types-collection";

import { ContractType } from "../../../entities";

export interface IContractManagerSearchDto extends ISearchDto {
  query: string;
  contractType: Array<ContractType>;
}
