import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsString, ValidateNested, IsEnum } from "class-validator";
import { Type, Transform } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountDto, ChainIdDto } from "@gemunion/collection";
import { ClaimType, IClaimCreateDto } from "@framework/types";

import { NotNativeDto } from "../../../exchange/asset/dto";

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
