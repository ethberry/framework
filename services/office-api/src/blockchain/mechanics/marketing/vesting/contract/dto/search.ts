import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { PaginationDto } from "@gemunion/collection";
import { AccountOptionalDto } from "@gemunion/nest-js-validators";
import { IVestingSearchDto } from "@framework/types";

export class VestingContractSearchDto extends Mixin(AccountOptionalDto, PaginationDto) implements IVestingSearchDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public merchantId: number;
}
