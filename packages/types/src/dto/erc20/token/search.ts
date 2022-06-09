import { ISearchDto } from "@gemunion/types-collection";

import { Erc20TokenStatus, Erc20TokenTemplate } from "../../../entities";

export interface IErc20TokenSearchDto extends ISearchDto {
  tokenStatus: Array<Erc20TokenStatus>;
  contractTemplate: Array<Erc20TokenTemplate>;
}
