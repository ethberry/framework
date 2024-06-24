import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { ReferrerDto } from "@gemunion/nest-js-validators";

import type { ISignRentTokenDto } from "../interfaces";

export class SignRentTokenDto extends Mixin(ReferrerDto) implements ISignRentTokenDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public tokenId: number;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public expires: number;

  @ApiProperty({
    minimum: 0,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public externalId: number;

  public chainId?: number;
  public account?: string;
}
