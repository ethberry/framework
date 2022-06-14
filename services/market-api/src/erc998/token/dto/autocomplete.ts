import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsString } from "class-validator";

import { IErc998TokenAutocompleteDto } from "../interface";

export class Erc998TokenAutocompleteDto implements IErc998TokenAutocompleteDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  public wallet: string;
}
