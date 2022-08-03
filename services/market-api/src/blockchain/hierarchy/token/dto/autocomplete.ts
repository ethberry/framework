import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsString } from "class-validator";
import { Transform } from "class-transformer";

import { ITokenAutocompleteDto } from "@framework/types";

export class TokenAutocompleteDto implements ITokenAutocompleteDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public account: string;
}
