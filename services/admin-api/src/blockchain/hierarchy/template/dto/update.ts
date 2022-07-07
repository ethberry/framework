import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsJSON, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IsBigNumber } from "@gemunion/nest-js-validators";
import { TemplateStatus } from "@framework/types";

import { ITemplateUpdateDto } from "../interfaces";
import { AssetDto } from "../../../asset/dto";

export class TemplateUpdateDto implements ITemplateUpdateDto {
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
    minimum: 0,
  })
  @IsOptional()
  @IsBigNumber({ minimum: "0" }, { message: "typeMismatch" })
  public amount: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsUrl({}, { message: "patternMismatch" })
  public imageUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(TemplateStatus, { message: "badInput" })
  public templateStatus: TemplateStatus;
}
