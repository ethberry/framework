import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsISO8601, IsString, Min } from "class-validator";

import { IDropCreateDto } from "../interfaces";

export class DropCreateDto implements IDropCreateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public templateId: number;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({ message: "patternMismatch" })
  public startTimestamp: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({ message: "patternMismatch" })
  public endTimestamp: string;
}
