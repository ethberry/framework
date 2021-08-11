import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

import { IsString } from "@gemunionstudio/nest-js-validators";

import { IsEmail } from "../../common/validators";
import { ILoginDto } from "../interfaces";

export class LoginDto implements ILoginDto {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public email: string;

  @ApiProperty()
  @IsString()
  public password: string;
}
