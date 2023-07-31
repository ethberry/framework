import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, MaxLength, MinLength } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto, ReferrerOptionalDto } from "@gemunion/collection";

import { ISignLotteryDto } from "../interfaces";

// import { LotteryTicketRule } from "./rule";

export class SignLotteryDto extends Mixin(AccountDto, ReferrerOptionalDto) implements ISignLotteryDto {
  // @ApiProperty()
  // @IsArray({ message: "typeMismatch" })
  // @ArrayMinSize(36, { message: "rangeUnderflow" })
  // @ArrayMaxSize(36, { message: "rangeOverflow" })
  // @IsBoolean({ each: true, message: "typeMismatch" })
  // @Validate(LotteryTicketRule, [6], {
  //   message: "typeMismatch",
  // })
  // public ticketNumbers: Array<boolean>;
  // TODO more validation?
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MinLength(66, { message: "rangeUnderflow" })
  @MaxLength(66, { message: "rangeOverflow" })
  // @Matches(/^[0-9A-Z]+$/, { message: "patternMismatch" })
  public ticketNumbers: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  public roundId: number;
}
