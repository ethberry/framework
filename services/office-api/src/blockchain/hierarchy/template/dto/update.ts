import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SearchableOptionalDto } from "@gemunion/collection";
import { TemplateStatus } from "@framework/types";

import { IsBigInt, SemiCoinDto } from "@gemunion/nest-js-validators";

import type { ITemplateUpdateDto } from "../interfaces";

export class TemplateUpdateDto extends SearchableOptionalDto implements ITemplateUpdateDto {
  @ApiPropertyOptional({
    type: SemiCoinDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public price: InstanceType<typeof SemiCoinDto>;

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
