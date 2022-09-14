import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEthereumAddress,
  IsOptional,
  IsString,
} from "class-validator";
import { Transform } from "class-transformer";

import { AccountDto } from "@gemunion/collection";

import { ISignLotteryDto } from "../interfaces";

export class SignLotteryDto extends AccountDto implements ISignLotteryDto {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => (value === "" ? null : value.toLowerCase()))
  public referrer: string;
}
