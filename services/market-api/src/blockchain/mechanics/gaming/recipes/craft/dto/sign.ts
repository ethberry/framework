import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto, ReferrerOptionalDto, ChainIdDto } from "@gemunion/collection";
import type { ICraftSignDto } from "@framework/types";

export class CraftSignDto extends Mixin(AccountDto, ReferrerOptionalDto, ChainIdDto) implements ICraftSignDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public craftId: number;
}
