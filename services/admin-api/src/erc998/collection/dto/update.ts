import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsJSON, IsOptional, IsString, Validate } from "class-validator";
import { Transform } from "class-transformer";

import { ForbidEnumValues } from "@gemunion/nest-js-validators";
import { Erc998CollectionStatus } from "@framework/types";

import { IErc998CollectionUpdateDto } from "../interfaces";

export class Erc998CollectionUpdateDto implements IErc998CollectionUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiPropertyOptional({
    enum: Erc998CollectionStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as Erc998CollectionStatus)
  @IsEnum(Erc998CollectionStatus, { message: "badInput" })
  @Validate(ForbidEnumValues, [Erc998CollectionStatus.NEW])
  public collectionStatus: Erc998CollectionStatus;
}
