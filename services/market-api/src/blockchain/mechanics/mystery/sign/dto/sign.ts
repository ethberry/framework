import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEthereumAddress, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Transform } from "class-transformer";

import { AccountDto } from "@gemunion/collection";

import { ISignMysteryboxDto } from "../interfaces";

export class SignMysteryboxDto extends AccountDto implements ISignMysteryboxDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public mysteryboxId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => (value === "" ? null : value.toLowerCase()))
  public referrer: string;
}
