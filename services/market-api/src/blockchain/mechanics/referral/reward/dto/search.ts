import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsISO8601, IsOptional, IsString, ValidateIf } from "class-validator";

import { SearchDto } from "@gemunion/collection";
import { IReferralReportSearchDto } from "@framework/types";

import { IsBeforeDate } from "./is-before-date";

export class MarketplaceReportSearchDto extends SearchDto implements IReferralReportSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({ message: "patternMismatch" })
  @IsBeforeDate({ relatedPropertyName: "endTimestamp" })
  public startTimestamp: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({ message: "patternMismatch" })
  @ValidateIf(o => !!o.startTimestamp)
  public endTimestamp: string;
}
