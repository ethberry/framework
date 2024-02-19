import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";
import { IRentAutocompleteDto } from "../interfaces/autocomplete";
import { RentRuleStatus } from "@framework/types";

export class RentAutocompleteDto implements IRentAutocompleteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public contractId: number;

  @ApiPropertyOptional({
    enum: RentRuleStatus,
  })
  @Transform(({ value }) => value as RentRuleStatus)
  @IsOptional()
  @IsEnum(RentRuleStatus, { message: "badInput" })
  public rentStatus: RentRuleStatus;
}
