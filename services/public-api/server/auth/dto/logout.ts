import { ApiProperty } from "@nestjs/swagger";

import { IsString } from "@gemunionstudio/nest-js-validators";

import { ILogoutDto } from "../interfaces";

export class LogoutDto implements ILogoutDto {
  @ApiProperty()
  @IsString()
  public refreshToken: string;
}
