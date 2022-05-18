import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsJSON, IsOptional, IsString, IsUrl, IsEnum } from "class-validator";
import { Transform } from "class-transformer";

import { Erc1155CollectionStatus } from "@framework/types";

import { IErc1155CollectionUpdateDto } from "../interfaces";

export class Erc1155CollectionUpdateDto implements IErc1155CollectionUpdateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiPropertyOptional({
    enum: Erc1155CollectionStatus,
  })
  @Transform(({ value }) => value as Erc1155CollectionStatus)
  @IsEnum(Erc1155CollectionStatus, { message: "badInput" })
  public collectionStatus: Erc1155CollectionStatus;
}
