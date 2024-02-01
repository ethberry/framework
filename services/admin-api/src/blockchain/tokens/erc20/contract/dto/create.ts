import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Max, MaxLength, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AddressDto, ImageUrlOptionalDto, SearchableDto } from "@gemunion/collection";
import { IErc20ContractCreateDto } from "@framework/types";

export class Erc20ContractCreateDto
  extends Mixin(AddressDto, ImageUrlOptionalDto, SearchableDto)
  implements IErc20ContractCreateDto
{
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  public symbol: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  @Max(32, { message: "rangeOverflow" })
  public decimals: number;

  public merchantId: number;
}
