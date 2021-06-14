import {ApiProperty} from "@nestjs/swagger";

import {IsNumber} from "@trejgun/nest-js-validators";

import {IProfileUpdateDto} from "../interfaces";
import {UserCommonDto} from "../../common/schemas";

export class ProfileUpdateSchema extends UserCommonDto implements IProfileUpdateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsNumber({
    required: false,
    minimum: 1,
  })
  public id: number;
}
