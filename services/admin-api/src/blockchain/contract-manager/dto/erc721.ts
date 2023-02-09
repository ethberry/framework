import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsString, IsUrl, Max, MaxLength, Min } from "class-validator";
import { Transform } from "class-transformer";

import type { IErc721ContractDeployDto } from "@framework/types";
import { Erc721ContractTemplates } from "@framework/types";

export class Erc721ContractDeployDto implements IErc721ContractDeployDto {
  @ApiProperty({
    enum: Erc721ContractTemplates,
  })
  @Transform(({ value }) => value as Erc721ContractTemplates)
  @IsEnum(Erc721ContractTemplates, { message: "badInput" })
  public contractTemplate: Erc721ContractTemplates;

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
