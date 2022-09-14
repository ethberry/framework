import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

import { SearchableDto } from "@gemunion/collection";
import { INativeContractCreateDto } from "@framework/types";

export class NativeContractCreateDto extends SearchableDto implements INativeContractCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  public symbol: string;
}
