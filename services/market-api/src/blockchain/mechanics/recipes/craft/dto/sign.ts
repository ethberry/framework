import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto, ReferrerOptionalDto } from "@gemunion/collection";
import type { ICraftSignDto } from "@framework/types";

import { ChainIdDto } from "../../../../../common/dto";

export class CraftSignDto extends Mixin(AccountDto, ReferrerOptionalDto, ChainIdDto) implements ICraftSignDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public craftId: number;
}
