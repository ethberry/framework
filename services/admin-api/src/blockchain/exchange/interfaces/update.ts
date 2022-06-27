import { ExchangeStatus } from "@framework/types";

import { IExchangeCreateDto } from "./create";

export interface IExchangeUpdateDto extends IExchangeCreateDto {
  exchangeStatus: ExchangeStatus;
}
