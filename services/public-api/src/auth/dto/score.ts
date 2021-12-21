import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import { IPasswordScoreDto } from "../interfaces";

export class ValidatePasswordScoreDto implements IPasswordScoreDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public password: string;
}
