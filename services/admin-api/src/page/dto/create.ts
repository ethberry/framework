import { ApiProperty } from "@nestjs/swagger";
import { IsJSON, IsString, Matches } from "class-validator";

import { IPageCreateDto } from "../interfaces";

export class PageCreateDto implements IPageCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @Matches(/^[0-9A-Z_-]+$/i, { message: "patternMismatch" })
  public slug: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;
}
