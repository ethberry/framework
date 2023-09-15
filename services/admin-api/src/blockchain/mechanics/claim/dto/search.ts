import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountOptionalDto, PaginationDto } from "@gemunion/collection";
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

  public claimType: Array<ClaimType>;
  public chainId: number;
  public merchantId: number;
}
