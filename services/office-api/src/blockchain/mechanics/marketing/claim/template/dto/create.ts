import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsISO8601, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { AccountDto, SemiNftDto } from "@ethberry/nest-js-validators";
import type { IClaimCreateDto } from "@framework/types";
import { ClaimType } from "@framework/types";

export class ClaimCreateDto extends AccountDto implements IClaimCreateDto {
  @ApiProperty({
    type: SemiNftDto,
  })
  @ValidateNested()
  @Type(() => SemiNftDto)
  public item: InstanceType<typeof SemiNftDto>;

  @ApiProperty()
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

  public claimType: ClaimType;
  public chainId: number;
}
