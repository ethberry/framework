import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

import { SearchableDto } from "@ethberry/collection";
import { symbolMaxLength, symbolMinLength } from "@ethberry/constants";
import { INativeContractCreateDto } from "@framework/types";

export class NativeContractCreateDto extends SearchableDto implements INativeContractCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MinLength(symbolMinLength, { message: "tooShort" })
  @MaxLength(symbolMaxLength, { message: "tooLong" })
  public symbol: string;

  public merchantId: number;
}
