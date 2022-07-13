import { ExchangeStatus } from "@framework/types";

import { IRecipeCreateDto } from "./create";

export interface IRecipeUpdateDto extends IRecipeCreateDto {
  exchangeStatus: ExchangeStatus;
}
