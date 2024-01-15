import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, IsISO8601, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { Mixin } from "ts-mixer";

import { AccountDto, ChainIdDto, ReferrerOptionalDto } from "@gemunion/collection";
import { IsBigInt } from "@gemunion/nest-js-validators";
import { CoinDto } from "../../asset/dto";
import { ITokenSellDto } from "../interfaces";

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