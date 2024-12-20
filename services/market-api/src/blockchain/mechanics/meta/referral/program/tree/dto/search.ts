import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { SearchDto } from "@gemunion/collection";

import { IReferralTreeSearchDto } from "../interfaces";

export class ReferralTreeSearchDto extends Mixin(SearchDto) implements IReferralTreeSearchDto {
  @ApiPropertyOptional({
    type: Number,
    isArray: true,
    minimum: 1,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  @Type(() => Number)
  public merchantIds: Array<number>;
}
