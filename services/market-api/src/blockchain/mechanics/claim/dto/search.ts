import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsEthereumAddress, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { PaginationDto } from "@gemunion/collection";
import { ClaimStatus, IClaimSearchDto } from "@framework/types";

export class ClaimSearchDto extends PaginationDto implements IClaimSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => (value === "" ? null : value.toLowerCase()))
  public account: string;

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
  public templateIds: Array<number>;

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
}
