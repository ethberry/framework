import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { SearchDto } from "@gemunion/collection";
import type { ISearchDto } from "@gemunion/types-collection";

export interface IReferralTreeSearchDto extends ISearchDto {
  wallet: string;
  referral: string;
  level: number;
  merchantIds: Array<number>;
}

export class ReferralTreeSearchDto extends Mixin(SearchDto) implements IReferralTreeSearchDto {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public wallet: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public referral: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  public level: number;
}
// export class ReferralTreeSearchDto implements IReferralTreeSearchDto {
//   @ApiPropertyOptional({
//     type: Number,
//     isArray: true,
//     minimum: 1,
//   })
//   @IsOptional()
//   @IsArray({ message: "typeMismatch" })
//   @IsInt({ each: true, message: "typeMismatch" })
//   @Min(1, { each: true, message: "rangeUnderflow" })
//   @Type(() => Number)
//   public merchantIds: Array<number>;
// }
