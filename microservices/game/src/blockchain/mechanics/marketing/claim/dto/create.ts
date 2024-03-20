import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsISO8601, IsString, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountDto, ChainIdDto, NotNativeDto } from "@gemunion/nest-js-validators";
import { ClaimType, IClaimCreateDto } from "@framework/types";

export class ClaimItemCreateDto extends Mixin(AccountDto, ChainIdDto) implements IClaimCreateDto {
  @ApiProperty({
    type: NotNativeDto,
  })
  @ValidateNested()
  @Type(() => NotNativeDto)
  public item: InstanceType<typeof NotNativeDto>;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;

  @ApiProperty({
    enum: ClaimType,
  })
  @Transform(({ value }) => value as ClaimType)
  @IsEnum(ClaimType, { message: "typeMismatch" })
  public claimType: ClaimType;
}
