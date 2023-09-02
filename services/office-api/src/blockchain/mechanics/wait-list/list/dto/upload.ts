import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { AccountDto } from "@gemunion/collection";

import type { IWaitListRow, IWaitListUploadDto } from "../interfaces";

export class WaitListRow extends AccountDto implements IWaitListRow {}

export class WaitListUploadDto implements IWaitListUploadDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public listId: number;

  @ApiProperty({
    type: WaitListRow,
    isArray: true,
  })
  @ValidateNested()
  @Type(() => WaitListRow)
  public items: Array<WaitListRow>;
}
