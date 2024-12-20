import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { PaginationDto } from "@gemunion/collection";
import { AccountOptionalDto } from "@gemunion/nest-js-validators";
import type { IClaimSearchDto } from "@framework/types";
import { ClaimStatus, ClaimType } from "@framework/types";

export class ClaimSearchDto extends Mixin(AccountOptionalDto, PaginationDto) implements IClaimSearchDto {
  @ApiPropertyOptional({
    enum: ClaimStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @Transform(({ value }) => value as Array<ClaimStatus>)
  @IsEnum(ClaimStatus, { each: true, message: "badInput" })
  public claimStatus: Array<ClaimStatus>;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public merchantId: number;

  public chainId: number;
  public claimType: Array<ClaimType>;
}
