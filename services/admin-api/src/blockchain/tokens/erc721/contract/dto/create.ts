import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { Mixin } from "ts-mixer";

import { SearchableDto } from "@gemunion/collection";
import { AddressDto } from "@gemunion/nest-js-validators";
import { IErc721ContractCreateDto } from "@framework/types";
import { symbolMaxLength, symbolMinLength } from "@gemunion/constants";

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

  public merchantId: number;
}
