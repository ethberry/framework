import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { ReferrerOptionalDto } from "@gemunion/nest-js-validators";

import type { IMysteryboxSignDto } from "../interfaces";

export class MysteryboxSignDto extends Mixin(ReferrerOptionalDto) implements IMysteryboxSignDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public mysteryBoxId: number;

  public chainId?: number;
  public account?: string;
}
