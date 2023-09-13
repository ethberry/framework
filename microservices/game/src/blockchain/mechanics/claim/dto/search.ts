import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountDto, PaginationDto } from "@gemunion/collection";
import { ClaimStatus, ClaimType } from "@framework/types";
import type { IClaimSearchDto } from "@framework/types";

export class ClaimSearchDto extends Mixin(AccountDto, PaginationDto) implements IClaimSearchDto {
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

  @ApiPropertyOptional({
    enum: ClaimType,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @Transform(({ value }) => value as Array<ClaimType>)
  @IsEnum(ClaimType, { each: true, message: "badInput" })
  public claimType: Array<ClaimType>;

  public chainId: number;
  public merchantId: number;
}
