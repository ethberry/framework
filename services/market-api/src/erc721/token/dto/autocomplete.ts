import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsString } from "class-validator";

import { IErc721AutocompleteDto } from "../interface";

export class Erc721AutocompleteDto implements IErc721AutocompleteDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  public wallet: string;
}
