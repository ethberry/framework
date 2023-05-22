import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsString, IsUrl } from "class-validator";
import { Transform } from "class-transformer";

import { SearchableDto } from "@gemunion/collection";
import { IErc1155ContractCreateDto } from "@framework/types";

export class Erc1155ContractCreateDto extends SearchableDto implements IErc1155ContractCreateDto {
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
