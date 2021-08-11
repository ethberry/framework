import {ApiProperty} from "@nestjs/swagger";

import {IsString} from "@gemunionstudio/nest-js-validators";

import {IPasswordScoreDto} from "../interfaces";

export class ValidatePasswordScoreDto implements IPasswordScoreDto {
  @ApiProperty()
  @IsString()
  public password: string;
}
