import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsUrl } from "class-validator";

import type { IPhotoCreateDto } from "../interfaces";

export class PhotoCreateDto implements IPhotoCreateDto {
  @ApiPropertyOptional()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  public priority: number;
}
