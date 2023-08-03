import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, IsUrl, MaxLength, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { SearchableDto } from "@gemunion/collection";
import { IErc721ContractCreateDto } from "@framework/types";

import { AddressDto } from "../../../../../common/dto";

export class Erc721ContractCreateDto extends Mixin(AddressDto, SearchableDto) implements IErc721ContractCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
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
