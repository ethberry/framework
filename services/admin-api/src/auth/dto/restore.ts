import { ApiProperty } from "@nestjs/swagger";

import { IsString } from "@gemunion/nest-js-validators";

import { IRestorePasswordDto } from "../interfaces";
import { ValidatePasswordDto } from "./password";

export class RestorePasswordDto extends ValidatePasswordDto implements IRestorePasswordDto {
  @ApiProperty()
  @IsString()
  public token: string;
}
