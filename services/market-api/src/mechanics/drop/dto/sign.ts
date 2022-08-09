import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEthereumAddress, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Transform } from "class-transformer";

import { ISignDropDto } from "../interfaces";

export class SignDropDto implements ISignDropDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public dropId: number;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public account: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public referral: string;
}
