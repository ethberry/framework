import { ISearchDto } from "@gemunion/types-collection";

import { UniContractStatus, Erc20ContractTemplate } from "../../../entities";

export interface IErc20ContractSearchDto extends ISearchDto {
  contractStatus: Array<UniContractStatus>;
  contractTemplate: Array<Erc20ContractTemplate>;
}
