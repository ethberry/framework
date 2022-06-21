import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress } from "class-validator";

import { IsBigNumber } from "@gemunion/nest-js-validators";

import { ILevelUpDtoDto } from "../interfaces";

export class LevelUpDto implements ILevelUpDtoDto {
  @ApiProperty({
    type: Number,
    minimum: 1,
  })
  @IsBigNumber({ minimum: "1" }, { message: "typeMismatch" })
  public tokenId: string;

  @ApiProperty()
  @IsEthereumAddress({ message: "patternMismatch" })
  public collection: string;
}
