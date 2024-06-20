import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

import type { IRentAutocompleteDto } from "../interfaces/autocomplete";

export class RentAutocompleteDto implements IRentAutocompleteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public contractId: number;
}
