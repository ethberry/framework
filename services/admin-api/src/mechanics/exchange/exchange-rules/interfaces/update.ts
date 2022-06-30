import { ExchangeStatus } from "@framework/types";

import { IExchangeRuleCreateDto } from "./create";

export interface IExchangeRuleUpdateDto extends IExchangeRuleCreateDto {
  exchangeStatus: ExchangeStatus;
}
