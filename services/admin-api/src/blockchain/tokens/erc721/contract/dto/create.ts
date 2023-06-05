import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsString, IsUrl, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

import { SearchableDto } from "@gemunion/collection";
import { IErc721ContractCreateDto } from "@framework/types";

export class Erc721ContractCreateDto extends SearchableDto implements IErc721ContractCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  public symbol: string;

  @ApiProperty()
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public address: string;

  @ApiProperty()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  public merchantId: number;
}
