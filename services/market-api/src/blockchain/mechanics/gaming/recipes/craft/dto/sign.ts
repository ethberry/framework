import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { ReferrerOptionalDto } from "@ethberry/nest-js-validators";
import type { ICraftSignDto } from "@framework/types";

export class CraftSignDto extends Mixin(ReferrerOptionalDto) implements ICraftSignDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public craftId: number;

  public chainId: number;
  public account: string;
}
