import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, IsUrl, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AddressDto, SearchableDto } from "@gemunion/collection";
import { IErc1155ContractCreateDto } from "@framework/types";

export class Erc1155ContractCreateDto extends Mixin(AddressDto, SearchableDto) implements IErc1155ContractCreateDto {
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
