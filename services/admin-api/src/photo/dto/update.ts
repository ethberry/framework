import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { PhotoStatus } from "@gemunion/framework-types";

import { IPhotoUpdateDto } from "../interfaces";

export class PhotoUpdateDto implements IPhotoUpdateDto {
  @ApiProperty({
    enum: PhotoStatus,
  })
  @IsEnum(
    {
      enum: PhotoStatus,
    },
    { message: "badInput" },
  )
  photoStatus: PhotoStatus;
}
