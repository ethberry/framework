import {ApiProperty} from "@nestjs/swagger";

import {reEmail} from "@gemunionstudio/constants-regexp";
import {IsString} from "@gemunionstudio/nest-js-validators";

import {IsEmail} from "../../common/validators";
import {ILoginDto} from "../interfaces";

export class LoginDto implements ILoginDto {
  @ApiProperty()
  @IsEmail({
    regexp: reEmail,
  })
  public email: string;

  @ApiProperty()
  @IsString()
  public password: string;
}
