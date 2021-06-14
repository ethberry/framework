import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

import {IsString} from "@trejgun/nest-js-validators";

import {IPhotoCreateDto} from "../interfaces";

export class PhotoCreateSchema implements IPhotoCreateDto {
  @ApiPropertyOptional()
  @IsString({
    required: false,
  })
  public title: string;

  @ApiProperty()
  @IsString()
  public imageUrl: string;
}
