import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean } from "class-validator";
import { Transform } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountDto, ReferrerOptionalDto } from "@gemunion/collection";

import { ISignRaffleDto } from "../interfaces";

export class SignRaffleDto extends Mixin(AccountDto, ReferrerOptionalDto) implements ISignRaffleDto {
  @ApiProperty({
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<boolean>)
  @IsBoolean({ each: true, message: "badInput" })
  @ArrayMinSize(36, { message: "tooShort" })
  @ArrayMaxSize(36, { message: "tooLong" })
  public ticketNumbers: Array<boolean>;
}
