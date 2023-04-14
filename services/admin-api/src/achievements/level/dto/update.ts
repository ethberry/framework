import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Max, Min } from "class-validator";

import { SearchableDto } from "@gemunion/collection";

import { IAchievementLevelUpdateDto } from "../interfaces";

export class AddressUpdateDto extends SearchableDto implements IAchievementLevelUpdateDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Max(1000, { message: "rangeOverflow" })
  public amount: number;
}
