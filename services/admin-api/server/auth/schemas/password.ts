import {ApiProperty} from "@nestjs/swagger";

import {IsConfirm, IsPassword} from "@trejgun/nest-js-validators";

import {IPasswordDto} from "../interfaces";

export class ValidatePasswordSchema implements IPasswordDto {
  @ApiProperty()
  @IsPassword()
  public password: string;

  @ApiProperty()
  @IsConfirm()
  public confirm: string;
}
