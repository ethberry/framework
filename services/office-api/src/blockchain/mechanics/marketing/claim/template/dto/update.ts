import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsISO8601, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { AccountOptionalDto, SemiNftDto } from "@ethberry/nest-js-validators";
import type { IClaimUpdateDto } from "@framework/types";

export class ClaimTemplateUpdateDto extends AccountOptionalDto implements IClaimUpdateDto {
  @ApiPropertyOptional({
    type: SemiNftDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SemiNftDto)
  public item: InstanceType<typeof SemiNftDto>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public merchantId: number;

  public chainId: number;
}
