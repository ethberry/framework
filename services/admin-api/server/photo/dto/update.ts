import {ApiProperty} from "@nestjs/swagger";

import {IsString} from "@gemunionstudio/nest-js-validators";
import {PhotoStatus} from "@gemunionstudio/framework-types";

import {IPhotoUpdateDto} from "../interfaces";

export class PhotoUpdateDto implements IPhotoUpdateDto {
  @ApiProperty({
    enum: PhotoStatus,
  })
  @IsString({
    enum: PhotoStatus,
  })
  photoStatus: PhotoStatus;
}
