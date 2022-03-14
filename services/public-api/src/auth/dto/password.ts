import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import { IsConfirm, IsPassword } from "@gemunion/nest-js-validators";
import { IPasswordDto } from "@gemunion/framework-types";

export class ValidatePasswordDto implements IPasswordDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsPassword({}, { message: "weak" })
  public password: string;

  @ApiProperty()
  @IsConfirm({}, { message: "badInput" })
  public confirm: string;
}
