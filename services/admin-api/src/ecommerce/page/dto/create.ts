import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

import { SearchableDto } from "@gemunion/collection";

import { IPageCreateDto } from "../interfaces";

export class PageCreateDto extends SearchableDto implements IPageCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @Matches(/^[0-9A-Z_-]+$/i, { message: "patternMismatch" })
  public slug: string;
}
