import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@ethberry/collection";
import type { IVestingBoxSearchDto } from "@framework/types";
import { VestingBoxStatus } from "@framework/types";

export class VestingBoxSearchDto extends SearchDto implements IVestingBoxSearchDto {
  @ApiPropertyOptional({
    enum: VestingBoxStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<VestingBoxStatus>)
  @IsEnum(VestingBoxStatus, { each: true, message: "badInput" })
  public vestingBoxStatus: Array<VestingBoxStatus>;

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
  public contractIds: Array<number>;

  public chainId: bigint;
  public merchantId: number;
}
