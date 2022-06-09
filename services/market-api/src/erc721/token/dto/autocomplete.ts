import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsString } from "class-validator";

import { IErc721TokenAutocompleteDto } from "../interface";

export class Erc721TokenAutocompleteDto implements IErc721TokenAutocompleteDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  public wallet: string;
}
