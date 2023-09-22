import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

import { AccountDto } from "@gemunion/collection";

import type { ISignalMessageDto } from "../interfaces";

export class MessageDto extends AccountDto implements ISignalMessageDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(128, { message: "rangeOverflow" })
  public transactionHash: string;
}
