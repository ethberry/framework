import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString } from "class-validator";

import { IPhotoCreateDto } from "../interfaces";

export class PhotoCreateDto implements IPhotoCreateDto {
  @ApiPropertyOptional()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  public priority: number;
}
