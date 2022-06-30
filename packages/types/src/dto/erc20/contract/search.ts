import { ISearchDto } from "@gemunion/types-collection";

import { ContractStatus, Erc20ContractTemplate } from "../../../entities";

export interface IErc20ContractSearchDto extends ISearchDto {
  contractStatus: Array<ContractStatus>;
  contractTemplate: Array<Erc20ContractTemplate>;
}
