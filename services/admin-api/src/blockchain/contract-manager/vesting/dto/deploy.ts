import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsString, IsUrl, Max, MaxLength, Min, MinLength } from "class-validator";
import { Transform } from "class-transformer";

import { symbolMaxLength, symbolMinLength, titleMaxLength, titleMinLength } from "@ethberry/constants";
import type { IVestingContractDeployDto } from "@framework/types";
import { VestingContractTemplates } from "@framework/types";

export class VestingContractDeployDto implements IVestingContractDeployDto {
  @ApiProperty({
    enum: VestingContractTemplates,
  })
  @Transform(({ value }) => value as VestingContractTemplates)
  @IsEnum(VestingContractTemplates, { message: "badInput" })
  public contractTemplate: VestingContractTemplates;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MinLength(titleMinLength, { message: "tooShort" })
  @MaxLength(titleMaxLength, { message: "tooLong" })
  public name: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MinLength(symbolMinLength, { message: "tooShort" })
  @MaxLength(symbolMaxLength, { message: "tooLong" })
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
