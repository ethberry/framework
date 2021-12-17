import { ApiProperty } from "@nestjs/swagger";

import { IsString } from "@gemunion/nest-js-validators";
import { PhotoStatus } from "@gemunion/framework-types";

import { IPhotoUpdateDto } from "../interfaces";

export class PhotoUpdateDto implements IPhotoUpdateDto {
  @ApiProperty({
    enum: PhotoStatus,
  })
  @IsString({
    enum: PhotoStatus,
  })
  photoStatus: PhotoStatus;
}
