import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsJSON, IsOptional, IsString, IsUrl, Validate } from "class-validator";
import { Transform } from "class-transformer";

import { ForbidEnumValues } from "@gemunion/nest-js-validators";
import { UniContractStatus } from "@framework/types";

import { IErc1155CollectionUpdateDto } from "../interfaces";

export class Erc1155CollectionUpdateDto implements IErc1155CollectionUpdateDto {
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
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiPropertyOptional({
    enum: UniContractStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as UniContractStatus)
  @IsEnum(UniContractStatus, { message: "badInput" })
  @Validate(ForbidEnumValues, [UniContractStatus.NEW])
  public contractStatus: UniContractStatus;
}
