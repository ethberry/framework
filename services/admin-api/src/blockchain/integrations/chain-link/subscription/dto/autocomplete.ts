import { IsInt, IsOptional, Min } from "class-validator";
import { Transform } from "class-transformer";

import { ChainIdDto } from "@gemunion/nest-js-validators";

import { ISubscriptionAutocompleteDto } from "../interfaces";

export class SubscriptionAutocompleteDto extends ChainIdDto implements ISubscriptionAutocompleteDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public merchantId: number;
}
