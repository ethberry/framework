import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";
import { Mixin } from "ts-mixer";

import { ReferrerOptionalDto } from "@gemunion/nest-js-validators";
import type { IRaffleSignDto } from "@framework/types";

export class RaffleSignDto extends Mixin(ReferrerOptionalDto) implements IRaffleSignDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  public contractId: number;

  public account: string;
  public chainId: number;
}
