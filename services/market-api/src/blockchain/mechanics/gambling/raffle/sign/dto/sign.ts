import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";
import { Mixin } from "ts-mixer";

import { ReferrerOptionalDto } from "@gemunion/nest-js-validators";
import type { ISignRaffleDto } from "@framework/types";

export class SignRaffleDto extends Mixin(ReferrerOptionalDto) implements ISignRaffleDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  public contractId: number;

  public account?: string;
}
