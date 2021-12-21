import { ApiProperty } from "@nestjs/swagger";
import { IsJSON, IsNumber, IsString } from "class-validator";

import { ICategoryCreateDto } from "../interfaces";

export class CategoryCreateDto implements ICategoryCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiProperty()
  @IsNumber({}, { message: "typeMismatch" })
  public parentId: number;
}
