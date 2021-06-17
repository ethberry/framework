import {ApiProperty} from "@nestjs/swagger";

import {IsString} from "@trejgun/nest-js-validators";

import {IRefreshDto} from "../interfaces";

export class RefreshDto implements IRefreshDto {
  @ApiProperty()
  @IsString()
  public refreshToken: string;
}
