import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SearchableDto } from "@gemunion/collection";
import type { IWaitListListCreateDto } from "@framework/types";

import { ItemDto } from "../../../../exchange/asset/dto";

export class WaitListListCreateDto extends SearchableDto implements IWaitListListCreateDto {
  @ApiProperty({
    type: ItemDto,
  })
  @ValidateNested()
  @Type(() => ItemDto)
  public item: ItemDto;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiProperty()
  @IsBoolean({ message: "typeMismatch" })
  public isPrivate: boolean;
}
