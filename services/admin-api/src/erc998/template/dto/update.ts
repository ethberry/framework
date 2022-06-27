import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsJSON, IsOptional, IsString, IsUrl, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { UniTemplateStatus } from "@framework/types";

import { IErc998TemplateUpdateDto } from "../interfaces";
import { AssetDto } from "../../../uni-token/dto";

export class Erc998TemplateUpdateDto implements IErc998TemplateUpdateDto {
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
  @IsJSON({ message: "patternMismatch" })
  public attributes: string;

  @ApiPropertyOptional({
    type: AssetDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AssetDto)
  public price: AssetDto;

  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public erc20TokenId: number;

  @ApiPropertyOptional({
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public amount: number;

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UniTemplateStatus, { message: "badInput" })
  public templateStatus: UniTemplateStatus;
}
