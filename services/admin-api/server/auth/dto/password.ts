import { ApiProperty } from "@nestjs/swagger";

import { IsConfirm, IsPassword } from "@gemunion/nest-js-validators";
import { IPasswordDto } from "@gemunion/framework-types";

export class ValidatePasswordDto implements IPasswordDto {
  @ApiProperty()
  @IsPassword()
  public password: string;

  @ApiProperty()
  @IsConfirm()
  public confirm: string;
}
