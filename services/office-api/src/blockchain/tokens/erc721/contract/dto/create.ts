import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, IsUrl, MaxLength, Min, MinLength } from "class-validator";
import { Mixin } from "ts-mixer";

import { SearchableDto } from "@ethberry/collection";
import { AddressDto } from "@ethberry/nest-js-validators";
import { IErc721ContractCreateDto } from "@framework/types";
import { symbolMaxLength, symbolMinLength } from "@ethberry/constants";

export class Erc721ContractCreateDto extends Mixin(AddressDto, SearchableDto) implements IErc721ContractCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MinLength(symbolMinLength, { message: "tooShort" })
  @MaxLength(symbolMaxLength, { message: "tooLong" })
  public symbol: string;

  @ApiProperty()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public merchantId: number;
}
