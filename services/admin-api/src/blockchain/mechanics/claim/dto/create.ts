import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { AccountDto } from "@gemunion/collection";

import { IClaimItemCreateDto } from "../interfaces";
import { ItemDto } from "../../../exchange/asset/dto";

export class ClaimItemCreateDto extends AccountDto implements IClaimItemCreateDto {
  @ApiProperty({
    type: ItemDto,
  })
  @ValidateNested()
  @Type(() => ItemDto)
  public item: ItemDto;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;
}
