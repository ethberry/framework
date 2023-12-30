import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsString, IsUrl, Max, MaxLength, Min } from "class-validator";
import { Transform } from "class-transformer";

import type { IErc998ContractDeployDto } from "@framework/types";
import { Erc998ContractTemplates } from "@framework/types";

export class Erc998ContractDeployDto implements IErc998ContractDeployDto {
  @ApiProperty({
    enum: Erc998ContractTemplates,
  })
  @Transform(({ value }) => value as Erc998ContractTemplates)
  @IsEnum(Erc998ContractTemplates, { message: "badInput" })
  public contractTemplate: Erc998ContractTemplates;

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