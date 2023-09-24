import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, MaxLength, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { AccountDto } from "@gemunion/collection";

import type { ISignalMessageDto } from "../interfaces";
import { ContractEventType } from "@framework/types";

export class MessageDto extends AccountDto implements ISignalMessageDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(128, { message: "rangeOverflow" })
  public transactionHash: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value as ContractEventType)
  @IsEnum(ContractEventType, { message: "badInput" })
  public transactionType: ContractEventType;
}
