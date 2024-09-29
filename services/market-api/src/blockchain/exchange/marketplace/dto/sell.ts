import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsISO8601, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { Mixin } from "ts-mixer";

import { AccountDto, ChainIdDto, CoinDto, IsBigInt, ReferrerOptionalDto } from "@ethberry/nest-js-validators";

import type { ITokenSellDto } from "../interfaces";

export class SellTokenDto extends Mixin(AccountDto, ReferrerOptionalDto, ChainIdDto) implements ITokenSellDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public tokenId: number;

  @ApiProperty({
    type: Number,
    minimum: 1,
  })
  @IsBigInt({}, { message: "typeMismatch" })
  public amount: string;

  @ApiProperty({
    type: CoinDto,
  })
  @ValidateNested()
  @Type(() => CoinDto)
  public price: InstanceType<typeof CoinDto>;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;
}
