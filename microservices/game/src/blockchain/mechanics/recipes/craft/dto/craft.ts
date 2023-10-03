import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto, ChainIdDto, ReferrerOptionalDto } from "@gemunion/collection";
import type { ICraftSignDto } from "@framework/types";

export class SignCraftDto extends Mixin(AccountDto, ReferrerOptionalDto, ChainIdDto) implements ICraftSignDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public craftId: number;
}
