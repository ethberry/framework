import { ApiProperty } from "@nestjs/swagger";

import { IsConfirm, IsPassword, IsString } from "@gemunion/nest-js-validators";

import { IPasswordUpdateDto } from "../interfaces";

export class PasswordUpdateDto implements IPasswordUpdateDto {
  @ApiProperty()
  @IsString()
  public current: string;

  @ApiProperty()
  @IsPassword()
  public password: string;

  @ApiProperty()
  @IsConfirm()
  public confirm: string;
}
