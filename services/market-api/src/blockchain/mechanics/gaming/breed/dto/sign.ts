import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { ReferrerOptionalDto } from "@ethberry/nest-js-validators";
import type { IBreedSignDto } from "@framework/types";

export class BreedSignDto extends Mixin(ReferrerOptionalDto) implements IBreedSignDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public momId: number;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public dadId: number;

  public chainId: number;
  public account: string;
}
