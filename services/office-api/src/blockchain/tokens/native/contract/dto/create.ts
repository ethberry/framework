import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, MaxLength, Min, MinLength } from "class-validator";

import { SearchableDto } from "@gemunion/collection";
import { INativeContractCreateDto } from "@framework/types";
import { symbolMaxLength, symbolMinLength } from "@gemunion/constants";

export class NativeContractCreateDto extends SearchableDto implements INativeContractCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MinLength(symbolMinLength, { message: "tooShort" })
  @MaxLength(symbolMaxLength, { message: "tooLong" })
  public symbol: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public merchantId: number;
}
