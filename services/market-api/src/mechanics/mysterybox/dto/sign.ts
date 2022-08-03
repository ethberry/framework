import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsInt, IsString, Min } from "class-validator";
import { Transform } from "class-transformer";

import { ISignMysteryboxDto } from "../interfaces";

export class SignMysteryboxDto implements ISignMysteryboxDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public mysteryboxId: number;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public account: string;
}
