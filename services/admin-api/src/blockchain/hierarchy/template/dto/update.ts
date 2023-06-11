import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SearchableDto } from "@gemunion/collection";
import { IsBigInt } from "@gemunion/nest-js-validators";
import { TemplateStatus } from "@framework/types";

import type { ITemplateUpdateDto } from "../interfaces";
import { PriceDto } from "../../../exchange/asset/dto";

export class TemplateUpdateDto extends SearchableDto implements ITemplateUpdateDto {
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
  @IsBigInt({ minimum: 0 }, { message: "typeMismatch" })
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
