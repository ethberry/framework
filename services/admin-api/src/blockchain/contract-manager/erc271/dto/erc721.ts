import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsString, IsUrl, Max, MaxLength, Min, MinLength } from "class-validator";
import { Transform } from "class-transformer";

import type { IErc721ContractDeployDto } from "@framework/types";
import { Erc721ContractTemplates } from "@framework/types";
import { symbolMaxLength, symbolMinLength, titleMaxLength, titleMinLength } from "@ethberry/constants";

export class Erc721ContractDeployDto implements IErc721ContractDeployDto {
  @ApiProperty({
    enum: Erc721ContractTemplates,
  })
  @Transform(({ value }) => value as Erc721ContractTemplates)
  @IsEnum(Erc721ContractTemplates, { message: "badInput" })
  public contractTemplate: Erc721ContractTemplates;

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
