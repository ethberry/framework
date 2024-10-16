import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsISO8601, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { AccountOptionalDto, AllTypesDto } from "@ethberry/nest-js-validators";
import type { IClaimUpdateDto } from "@framework/types";

export class ClaimTokenUpdateDto extends AccountOptionalDto implements IClaimUpdateDto {
  @ApiPropertyOptional({
    type: AllTypesDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AllTypesDto)
  public item: InstanceType<typeof AllTypesDto>;

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
