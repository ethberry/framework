import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

import type { IMessageDto } from "../interfaces";
import { SignalType } from "../interfaces";

export class MessageDto implements IMessageDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(128, { message: "rangeOverflow" })
  public sub: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(128, { message: "rangeOverflow" })
  public txHash: string;

  @ApiProperty()
  @Transform(({ value }) => value as SignalType)
  @IsEnum(SignalType, { message: "badInput" })
  public signalType: SignalType;
}
