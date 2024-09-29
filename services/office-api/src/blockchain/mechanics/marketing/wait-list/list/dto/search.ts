import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { SearchDto } from "@ethberry/collection";
import { AccountOptionalDto } from "@ethberry/nest-js-validators";
import type { IWaitListListSearchDto } from "@framework/types";

export class WaitListListSearchDto extends Mixin(AccountOptionalDto, SearchDto) implements IWaitListListSearchDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public merchantId: number;
}
