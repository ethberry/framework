import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { PaginationDto } from "@gemunion/collection";
import { AccountOptionalDto } from "@gemunion/nest-js-validators";
import type { IWaitListItemSearchDto } from "@framework/types";

export class WaitListItemSearchDto extends Mixin(AccountOptionalDto, PaginationDto) implements IWaitListItemSearchDto {
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
  public listIds: Array<number>;

  public merchantId: number;
}
