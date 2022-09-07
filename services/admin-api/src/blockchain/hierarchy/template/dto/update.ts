import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsJSON, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IsBigNumber } from "@gemunion/nest-js-validators";
import { TemplateStatus } from "@framework/types";

import { ITemplateUpdateDto } from "../interfaces";
import { PriceDto } from "../../../mechanics/asset/dto";

export class TemplateUpdateDto implements ITemplateUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiPropertyOptional({
    type: PriceDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PriceDto)
  public price: PriceDto;

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
