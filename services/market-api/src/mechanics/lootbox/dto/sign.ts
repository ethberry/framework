import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsInt, IsString, Min } from "class-validator";

import { ISignLootboxDto } from "../interfaces";

export class SignLootboxDto implements ISignLootboxDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public lootboxId: number;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  public account: string;
}
