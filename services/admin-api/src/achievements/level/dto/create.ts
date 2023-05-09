import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Max, Min, ValidateNested, IsISO8601 } from "class-validator";
import { Type } from "class-transformer";

import { SearchableDto } from "@gemunion/collection";
import { IsBeforeDate } from "@gemunion/nest-js-validators";

import { IAchievementLevelCreateDto } from "../interfaces";
import { ItemDto } from "../../../blockchain/exchange/asset/dto";

export class AchievementLevelCreateDto extends SearchableDto implements IAchievementLevelCreateDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public achievementLevel: number;

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

  @ApiPropertyOptional()
  @IsOptional()
  // @IsJSON({ message: "patternMismatch" })
  public attributes: Record<string, string | number>;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  @IsBeforeDate({ relatedPropertyName: "endTimestamp" })
  public startTimestamp: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;
}
