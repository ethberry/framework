import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsString, IsUrl, Max, MaxLength, Min } from "class-validator";
import { Transform } from "class-transformer";

import type { ICollectionContractDeployDto } from "@framework/types";
import { CollectionContractTemplates } from "@framework/types";

export class Erc721CollectionDeployDto implements ICollectionContractDeployDto {
  @ApiProperty({
    enum: CollectionContractTemplates,
  })
  @Transform(({ value }) => value as CollectionContractTemplates)
  @IsEnum(CollectionContractTemplates, { message: "badInput" })
  public contractTemplate: CollectionContractTemplates;

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

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  @Max(10000, { message: "rangeOverflow" })
  public batchSize: number;
}
