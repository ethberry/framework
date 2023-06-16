import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto, ReferrerOptionalDto } from "@gemunion/collection";

import { ISignLotteryDto } from "../interfaces";

export class SignLotteryDto extends Mixin(AccountDto, ReferrerOptionalDto) implements ISignLotteryDto {
  @ApiProperty()
  // TODO validation
  @IsString({ message: "badInput" })
  public ticketNumbers: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  public roundId: number;
}
