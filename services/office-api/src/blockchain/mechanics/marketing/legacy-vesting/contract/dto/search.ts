import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { PaginationDto } from "@ethberry/collection";
import { AccountOptionalDto } from "@ethberry/nest-js-validators";
import type { ILegacyVestingContractSearchDto } from "@framework/types";
import { LegacyVestingContractFeatures } from "@framework/types";

export class VestingContractSearchDto extends Mixin(AccountOptionalDto, PaginationDto) implements ILegacyVestingContractSearchDto {
  @ApiPropertyOptional({
    enum: LegacyVestingContractFeatures,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<LegacyVestingContractFeatures>)
  @IsEnum(LegacyVestingContractFeatures, { each: true, message: "badInput" })
  public contractFeatures: Array<LegacyVestingContractFeatures>;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public merchantId: number;
}
