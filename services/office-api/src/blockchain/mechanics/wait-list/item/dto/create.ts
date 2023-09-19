import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import { AccountDto } from "@gemunion/collection";
import type { IWaitListItemCreateDto } from "@framework/types";

export class WaitListItemCreateDto extends AccountDto implements IWaitListItemCreateDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public listId: number;
}
