import { ApiPropertyOptional } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountDto } from "@gemunion/collection";

import { ISignLotteryDto } from "../interfaces";
import { ReferrerOptionalDto } from "../../../../../common/validators/referrer";

export class SignLotteryDto extends Mixin(ReferrerOptionalDto, AccountDto) implements ISignLotteryDto {
  @ApiPropertyOptional({
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<boolean>)
  @IsBoolean({ each: true, message: "badInput" })
  @ArrayMinSize(36, { message: "tooShort" })
  @ArrayMaxSize(36, { message: "tooLong" })
  public ticketNumbers: Array<boolean>;
}
