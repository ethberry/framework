import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsJSON, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

import { Erc721CollectionStatus } from "@framework/types";

import { IErc721CollectionUpdateDto } from "../interfaces";

export class Erc721CollectionUpdateDto implements IErc721CollectionUpdateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiPropertyOptional({
    enum: Erc721CollectionStatus,
  })
  @Transform(({ value }) => value as Erc721CollectionStatus)
  @IsEnum(Erc721CollectionStatus, { message: "badInput" })
  public collectionStatus: Erc721CollectionStatus;
}
