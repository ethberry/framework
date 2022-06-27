import { ISearchDto } from "@gemunion/types-collection";

import { UniContractStatus } from "../../../entities";

export interface IErc1155ContractSearchDto extends ISearchDto {
  contractStatus: Array<UniContractStatus>;
}
