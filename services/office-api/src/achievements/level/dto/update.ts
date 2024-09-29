import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SearchableDto } from "@ethberry/collection";

import { IAchievementLevelUpdateDto } from "../interfaces";
import { AllTypesDto } from "@ethberry/nest-js-validators";

export class AddressUpdateDto extends SearchableDto implements IAchievementLevelUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public achievementLevel: number;

  @ApiPropertyOptional({
    type: AllTypesDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AllTypesDto)
  public reward: InstanceType<typeof AllTypesDto>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Max(1000, { message: "rangeOverflow" })
  public amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  // @IsJSON({ message: "patternMismatch" })
  public parameters: Record<string, string | number>;
}
