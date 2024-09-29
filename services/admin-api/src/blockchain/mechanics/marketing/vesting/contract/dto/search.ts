import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { Mixin } from "ts-mixer";

import { PaginationDto } from "@ethberry/collection";
import { AccountOptionalDto } from "@ethberry/nest-js-validators";
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

  public merchantId: number;
}
