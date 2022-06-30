import { ISearchDto } from "@gemunion/types-collection";

import { ContractStatus, ContractRole } from "../../../entities";

export interface IErc721ContractSearchDto extends ISearchDto {
  contractStatus: Array<ContractStatus>;
  contractRole: Array<ContractRole>;
}
