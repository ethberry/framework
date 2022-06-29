import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsString } from "class-validator";

import { IUniTokenAutocompleteDto } from "../interface";

export class Erc998TokenAutocompleteDto implements IUniTokenAutocompleteDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  public wallet: string;
}
