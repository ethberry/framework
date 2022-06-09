import { IPaginationDto } from "@gemunion/types-collection";

import { ContractType } from "../../../entities";

export interface IContractManagerSearchDto extends IPaginationDto {
  query: string;
  contractType: Array<ContractType>;
}
