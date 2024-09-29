import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsISO8601, IsOptional, IsString, ValidateIf, IsArray, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

import type { ISearchDto } from "@ethberry/types-collection";
import { SearchDto } from "@ethberry/collection";
import { IsBeforeDate } from "@ethberry/nest-js-validators";
// import { IReferralClaimSearchDto } from "@framework/types";

export interface IReferralClaimSearchDto extends ISearchDto {
  merchantIds?: Array<number>;
}

export class ReferralClaimSearchDto extends SearchDto implements IReferralClaimSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  @IsBeforeDate({ relatedPropertyName: "endTimestamp" })
  public startTimestamp: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  @ValidateIf(o => !!o.startTimestamp)
  public endTimestamp: string;

  @ApiPropertyOptional({
    type: Number,
    isArray: true,
    minimum: 1,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  @Type(() => Number)
  public merchantIds: Array<number>;
}
