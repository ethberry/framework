import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsString, IsUrl, Max, MaxLength, Min } from "class-validator";
import { Transform } from "class-transformer";

import type { IMysteryContractDeployDto } from "@framework/types";
import { MysteryContractFeatures } from "@framework/types";

export class MysteryContractDeployDto implements IMysteryContractDeployDto {
  @ApiProperty({
    enum: MysteryContractFeatures,
    isArray: true,
  })
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<MysteryContractFeatures>)
  @IsEnum(MysteryContractFeatures, { each: true, message: "badInput" })
  public contractFeatures: Array<MysteryContractFeatures>;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  public name: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  public symbol: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  @Max(1000, { message: "rangeOverflow" })
  public royalty: number;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(128, { message: "rangeOverflow" })
  @IsUrl({ require_tld: false }, { message: "patternMismatch" })
  public baseTokenURI: string;
}
