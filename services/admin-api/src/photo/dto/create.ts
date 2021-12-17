import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsString } from "@gemunion/nest-js-validators";

import { IPhotoCreateDto } from "../interfaces";

export class PhotoCreateDto implements IPhotoCreateDto {
  @ApiPropertyOptional()
  @IsString({
    required: false,
  })
  public title: string;

  @ApiProperty()
  @IsString()
  public imageUrl: string;

  priority: number;
}
