import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import { ILogoutDto } from "../interfaces";

export class LogoutDto implements ILogoutDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public refreshToken: string;
}
