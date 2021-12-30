import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { MerchantStatus } from "@gemunion/framework-types";

import { IMerchantUpdateDto } from "../interfaces";
import { MerchantCreateDto } from "./create";

export class MerchantUpdateDto extends MerchantCreateDto implements IMerchantUpdateDto {
  @ApiPropertyOptional({
    enum: MerchantStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as MerchantStatus)
  @IsEnum(MerchantStatus, { message: "badInput" })
  public merchantStatus: MerchantStatus;
}
