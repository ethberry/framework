import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import { IRefreshDto } from "../interfaces";

export class RefreshDto implements IRefreshDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public refreshToken: string;
}
