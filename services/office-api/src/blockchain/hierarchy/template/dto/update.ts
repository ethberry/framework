import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SearchableOptionalDto } from "@gemunion/collection";
import { IsBigNumber } from "@gemunion/nest-js-validators";
import { TemplateStatus } from "@framework/types";

import { PriceDto } from "../../../exchange/asset/dto";
import type { ITemplateUpdateDto } from "../interfaces";

export class TemplateUpdateDto extends SearchableOptionalDto implements ITemplateUpdateDto {
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
