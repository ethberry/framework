import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { PaginationDto } from "@gemunion/collection";
import { AccountOptionalDto } from "@gemunion/nest-js-validators";
import type { IVestingSearchDto } from "@framework/types";
import { VestingContractFeatures } from "@framework/types";

export class VestingContractSearchDto extends Mixin(AccountOptionalDto, PaginationDto) implements IVestingSearchDto {
  @ApiPropertyOptional({
    enum: VestingContractFeatures,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<VestingContractFeatures>)
  @IsEnum(VestingContractFeatures, { each: true, message: "badInput" })
  public contractFeatures: Array<VestingContractFeatures>;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public merchantId: number;
}
