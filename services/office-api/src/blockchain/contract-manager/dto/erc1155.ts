import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsString, IsUrl, Max, MaxLength, Min } from "class-validator";
import { Transform } from "class-transformer";

import type { IErc1155ContractDeployDto } from "@framework/types";
import { Erc1155ContractTemplates } from "@framework/types";

export class Erc1155ContractDeployDto implements IErc1155ContractDeployDto {
  @ApiProperty({
    enum: Erc1155ContractTemplates,
  })
  @Transform(({ value }) => value as Erc1155ContractTemplates)
  @IsEnum(Erc1155ContractTemplates, { message: "badInput" })
  public contractTemplate: Erc1155ContractTemplates;

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
