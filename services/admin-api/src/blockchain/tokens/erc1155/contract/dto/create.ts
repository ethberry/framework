import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUrl } from "class-validator";
import { Mixin } from "ts-mixer";

import { SearchableDto } from "@ethberry/collection";
import { AddressDto } from "@ethberry/nest-js-validators";
import { IErc1155ContractCreateDto } from "@framework/types";

export class Erc1155ContractCreateDto extends Mixin(AddressDto, SearchableDto) implements IErc1155ContractCreateDto {
  @ApiProperty()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  public merchantId: number;
}
