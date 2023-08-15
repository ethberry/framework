import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto, ReferrerOptionalDto } from "@gemunion/collection";

import { ISignRaffleDto } from "../interfaces";

export class SignRaffleDto extends Mixin(AccountDto, ReferrerOptionalDto) implements ISignRaffleDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  public contractId: number;
}
