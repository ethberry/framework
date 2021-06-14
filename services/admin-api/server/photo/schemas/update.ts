import {ApiProperty} from "@nestjs/swagger";

import {IsString} from "@trejgun/nest-js-validators";
import {PhotoStatus} from "@trejgun/solo-types";

import {IPhotoUpdateDto} from "../interfaces";

export class PhotoUpdateSchema implements IPhotoUpdateDto {
  @ApiProperty({
    enum: PhotoStatus,
  })
  @IsString({
    enum: PhotoStatus,
  })
  photoStatus: PhotoStatus;
}
