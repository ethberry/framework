import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, Min, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountOptionalDto, PaginationDto } from "@gemunion/collection";
import { IWaitListItemSearchDto } from "@framework/types";

export class WaitListSearchDto extends Mixin(AccountOptionalDto, PaginationDto) implements IWaitListItemSearchDto {
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
}
