import { ApiProperty } from "@nestjs/swagger";

import { IsString } from "@gemunion/nest-js-validators";

import { IRefreshDto } from "../interfaces";

export class RefreshDto implements IRefreshDto {
  @ApiProperty()
  @IsString()
  public refreshToken: string;
}
