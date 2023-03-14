import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { PhotoStatus } from "@framework/types";

import { IPhotoUpdateDto } from "../interfaces";

export class PhotoUpdateDto implements IPhotoUpdateDto {
  @ApiProperty({
    enum: PhotoStatus,
  })
  @IsEnum(PhotoStatus, { message: "badInput" })
  public photoStatus: PhotoStatus;
}
