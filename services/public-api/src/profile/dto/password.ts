import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import { IsConfirm, IsPassword } from "@gemunion/nest-js-validators";

import { IPasswordUpdateDto } from "../interfaces";

export class PasswordUpdateDto implements IPasswordUpdateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public current: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsPassword({}, { message: "weak" })
  public password: string;

  @ApiProperty()
  @IsConfirm({}, { message: "badInput" })
  public confirm: string;
}
