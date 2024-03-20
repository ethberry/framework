import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Max, MaxLength, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { SearchableDto } from "@gemunion/collection";
import { AddressDto } from "@gemunion/nest-js-validators";
import type { IErc20ContractCreateDto } from "@framework/types";

export class Erc20ContractCreateDto extends Mixin(AddressDto, SearchableDto) implements IErc20ContractCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  public symbol: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  @Max(32, { message: "rangeOverflow" })
  public decimals: number;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public merchantId: number;
}
