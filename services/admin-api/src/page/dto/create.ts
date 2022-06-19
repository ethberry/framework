import { ApiProperty } from "@nestjs/swagger";
import { IsJSON, IsString } from "class-validator";

import { IPageCreateDto } from "../interfaces";

export class PageCreateDto implements IPageCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  // TODO validate /[a-z-]+/i
  public slug: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;
}
