import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, MaxLength, MinLength, Validate } from "class-validator";
import { Mixin } from "ts-mixer";

import { ReferrerOptionalDto } from "@gemunion/nest-js-validators";

import type { ILotterySignDto } from "../interfaces";
import { LotteryTicketRule } from "./rule";

export class LotterySignDto extends Mixin(ReferrerOptionalDto) implements ILotterySignDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MinLength(66, { message: "rangeUnderflow" })
  @MaxLength(66, { message: "rangeOverflow" })
  @Validate(LotteryTicketRule, [6, 36 /* 6 from 36 */], {
    message: "typeMismatch",
  })
  public ticketNumbers: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  public contractId: number;

  public chainId?: number;
  public account?: string;
}
