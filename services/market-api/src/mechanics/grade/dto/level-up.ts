import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import { ILevelUpDtoDto } from "../interfaces";

export class LevelUpDto implements ILevelUpDtoDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public tokenId: number;
}
