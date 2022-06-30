import { ISearchDto } from "@gemunion/types-collection";

import { ExchangeStatus } from "../../../entities";

export interface IExchangeSearchDto extends ISearchDto {
  exchangeStatus: Array<ExchangeStatus>;
}
