import {ApiProperty} from "@nestjs/swagger";

import {IsString} from "@trejgun/nest-js-validators";

import {IRestorePasswordDto} from "../interfaces";
import {ValidatePasswordSchema} from "./password";

export class RestorePasswordSchema extends ValidatePasswordSchema implements IRestorePasswordDto {
  @ApiProperty()
  @IsString()
  public token: string;
}
