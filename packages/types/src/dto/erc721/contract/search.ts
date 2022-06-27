import { ISearchDto } from "@gemunion/types-collection";

import { UniContractStatus, UniContractType } from "../../../entities";

export interface IErc721ContractSearchDto extends ISearchDto {
  contractStatus: Array<UniContractStatus>;
  contractType: Array<UniContractType>;
}
