import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, Validate } from "class-validator";
import { Transform } from "class-transformer";

import { ForbidEnumValues } from "@gemunion/nest-js-validators";
import { MerchantStatus, RatePlanType } from "@framework/types";

import type { IMerchantUpdateDto } from "../interfaces";
import { MerchantCreateDto } from "./create";

export class MerchantUpdateDto extends MerchantCreateDto implements IMerchantUpdateDto {
  @ApiPropertyOptional({
    enum: MerchantStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as MerchantStatus)
  @Validate(ForbidEnumValues, [MerchantStatus.PENDING])
  @IsEnum(MerchantStatus, { message: "badInput" })
  public merchantStatus: MerchantStatus;

  @ApiPropertyOptional({
    enum: RatePlanType,
  })
  @IsOptional()
  @Transform(({ value }) => value as RatePlanType)
  @IsEnum(RatePlanType, { message: "badInput" })
  public ratePlan: RatePlanType;
}
