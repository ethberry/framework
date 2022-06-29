import { ISearchDto } from "@gemunion/types-collection";

import { UniContractStatus, UniContractRole } from "../../../entities";

export interface IErc721ContractSearchDto extends ISearchDto {
  contractStatus: Array<UniContractStatus>;
  contractRole: Array<UniContractRole>;
}
