import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsString, IsUrl, Max, MaxLength, Min } from "class-validator";
import { Transform } from "class-transformer";

import type { IErc721CollectionDeployDto } from "@framework/types";
import { Erc721CollectionTemplates } from "@framework/types";

export class Erc721CollectionDeployDto implements IErc721CollectionDeployDto {
  @ApiProperty({
    enum: Erc721CollectionTemplates,
  })
  @Transform(({ value }) => value as Erc721CollectionTemplates)
  @IsEnum(Erc721CollectionTemplates, { message: "badInput" })
  public contractTemplate: Erc721CollectionTemplates;

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
