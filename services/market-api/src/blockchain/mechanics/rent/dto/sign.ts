import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto, ReferrerDto } from "@gemunion/collection";

import { ISignRentTokenDto } from "../interfaces";
import { ChainIdDto } from "../../../../common/dto";

export class SignRentTokenDto extends Mixin(ReferrerDto, AccountDto, ChainIdDto) implements ISignRentTokenDto {
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
}
