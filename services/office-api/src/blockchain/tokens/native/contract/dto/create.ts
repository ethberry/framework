import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, MaxLength, Min } from "class-validator";

import { SearchableDto } from "@gemunion/collection";
import { INativeContractCreateDto } from "@framework/types";

export class NativeContractCreateDto extends SearchableDto implements INativeContractCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  public symbol: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public merchantId: number;
}
