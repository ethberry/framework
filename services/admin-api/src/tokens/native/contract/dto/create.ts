import { ApiProperty } from "@nestjs/swagger";
import { IsJSON, IsString, MaxLength } from "class-validator";

import { INativeContractCreateDto } from "@framework/types";

export class NativeContractCreateDto implements INativeContractCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(5, { message: "rangeOverflow" })
  public symbol: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;
}
