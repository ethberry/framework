import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

import { ILoginDto } from "@gemunion/framework-types";

export class LoginDto implements ILoginDto {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public email: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public password: string;
}
