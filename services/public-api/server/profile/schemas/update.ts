import {ApiProperty} from "@nestjs/swagger";

import {IsNumber} from "@trejgun/nest-js-validators";

import {IProfileUpdateDto} from "../interfaces";
import {UserCommonSchema} from "../../common/schemas";

export class ProfileUpdateSchema extends UserCommonSchema implements IProfileUpdateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsNumber({
    required: false,
    minimum: 1,
  })
  public id: number;
}
