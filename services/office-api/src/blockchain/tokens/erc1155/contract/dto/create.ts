import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUrl } from "class-validator";
import { Mixin } from "ts-mixer";

import { SearchableDto } from "@gemunion/collection";
import { IErc1155ContractCreateDto } from "@framework/types";

import { AddressDto } from "../../../../../common/dto";

export class Erc1155ContractCreateDto extends Mixin(AddressDto, SearchableDto) implements IErc1155ContractCreateDto {
  @ApiProperty()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  public merchantId: number;
}