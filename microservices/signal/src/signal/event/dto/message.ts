import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

import { AccountDto } from "@ethberry/nest-js-validators";

import type { ISignalMessageDto } from "../interfaces";

export class MessageDto extends AccountDto implements ISignalMessageDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(128, { message: "rangeOverflow" })
  public transactionHash: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public transactionType: string;
}
