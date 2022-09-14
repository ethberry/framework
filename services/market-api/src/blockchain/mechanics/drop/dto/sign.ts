import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEthereumAddress, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Transform } from "class-transformer";

import { AccountDto } from "@gemunion/collection";

import { ISignDropDto } from "../interfaces";

export class SignDropDto extends AccountDto implements ISignDropDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public dropId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => (value === "" ? null : value.toLowerCase()))
  public referrer: string;
}
