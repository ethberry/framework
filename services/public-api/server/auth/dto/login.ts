import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

import { IsString } from "@gemunion/nest-js-validators";
import { ILoginDto } from "@gemunion/framework-types";

import { IsEmail } from "../../common/validators";

export class LoginDto implements ILoginDto {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public email: string;

  @ApiProperty()
  @IsString()
  public password: string;
}
