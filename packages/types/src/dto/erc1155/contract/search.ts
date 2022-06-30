import { ISearchDto } from "@gemunion/types-collection";

import { ContractStatus } from "../../../entities";

export interface IErc1155ContractSearchDto extends ISearchDto {
  contractStatus: Array<ContractStatus>;
}
