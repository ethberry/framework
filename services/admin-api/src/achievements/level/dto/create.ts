import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Max, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SearchableDto } from "@gemunion/collection";

import { IAchievementLevelCreateDto } from "../interfaces";
import { ItemDto } from "../../../blockchain/exchange/asset/dto";

export class AchievementLevelCreateDto extends SearchableDto implements IAchievementLevelCreateDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public achievementRuleId: number;

  @ApiProperty({
    type: ItemDto,
  })
  @ValidateNested()
  @Type(() => ItemDto)
  public item: ItemDto;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Max(1000, { message: "rangeOverflow" })
  public amount: number;
}
