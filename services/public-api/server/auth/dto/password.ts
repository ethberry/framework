import {ApiProperty} from "@nestjs/swagger";

import {IsConfirm, IsPassword} from "@gemunionstudio/nest-js-validators";

import {IPasswordDto} from "../interfaces";

export class ValidatePasswordDto implements IPasswordDto {
  @ApiProperty()
  @IsPassword()
  public password: string;

  @ApiProperty()
  @IsConfirm()
  public confirm: string;
}
