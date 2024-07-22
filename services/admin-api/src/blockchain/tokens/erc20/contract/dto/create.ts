import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { Mixin } from "ts-mixer";

import { SearchableDto } from "@gemunion/collection";
import { AddressDto, ImageUrlDto } from "@gemunion/nest-js-validators";
import { symbolMaxLength, symbolMinLength } from "@gemunion/constants";
import type { IErc20ContractCreateDto } from "@framework/types";

export class Erc20ContractCreateDto
  extends Mixin(AddressDto, ImageUrlDto, SearchableDto)
  implements IErc20ContractCreateDto
{
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MinLength(symbolMinLength, { message: "tooShort" })
  @MaxLength(symbolMaxLength, { message: "tooLong" })
  public symbol: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  @Max(32, { message: "rangeOverflow" })
  public decimals: number;

  public merchantId: number;
}
