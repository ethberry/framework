import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import { AccountDto } from "@gemunion/collection";

import { IWaitlistItemCreateDto } from "../interfaces";

export class WaitlistItemCreateDto extends AccountDto implements IWaitlistItemCreateDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public listId: number;
}
