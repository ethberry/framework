import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";
import { Mixin } from "ts-mixer";

import { SearchDto } from "@ethberry/collection";

import { IReferralTreeSearchDto } from "../interfaces";

export class ReferralTreeSearchDto extends Mixin(SearchDto) implements IReferralTreeSearchDto {
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
