import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

import { IPhotoCreateDto } from "../interfaces";

export class PhotoCreateDto implements IPhotoCreateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  priority: number;
}
