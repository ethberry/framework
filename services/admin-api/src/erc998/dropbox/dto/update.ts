import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsJSON, IsNumberString, IsOptional, IsString, IsUrl } from "class-validator";

import { Erc998DropboxStatus } from "@framework/types";

import { IErc998DropboxUpdateDto } from "../interfaces";

export class Erc998DropboxUpdateDto implements IErc998DropboxUpdateDto {
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
  @IsNumberString({}, { message: "typeMismatch" })
  public price: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  public erc998CollectionId: number;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  public erc998TemplateId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Erc998DropboxStatus, { message: "badInput" })
  public dropboxStatus: Erc998DropboxStatus;
}
