import { ISearchDto } from "@gemunion/types-collection";

import { Erc20TokenStatus } from "../../../entities";

export interface IErc20TokenSearchDto extends ISearchDto {
  tokenStatus: Array<Erc20TokenStatus>;
}
