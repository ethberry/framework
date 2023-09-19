import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { IsBigInt } from "@gemunion/nest-js-validators";
import type { ITemplateSearchDto } from "@framework/types";
import { ModuleType, TemplateStatus, TokenType } from "@framework/types";

export class TemplateSearchDto extends SearchDto implements ITemplateSearchDto {
  @ApiPropertyOptional({
    type: Number,
    isArray: true,
    minimum: 1,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  @Type(() => Number)
  public contractIds: Array<number>;

  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
  })
  @IsOptional()
  @IsBigInt({ allowEmptyString: true }, { message: "typeMismatch" })
  public tokenId: string;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsBigInt({}, { message: "typeMismatch" })
  public minPrice: string;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsBigInt({}, { message: "typeMismatch" })
  public maxPrice: string;

  @ApiPropertyOptional({
    enum: TemplateStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<TemplateStatus>)
  @IsEnum(TemplateStatus, { each: true, message: "badInput" })
  public templateStatus: Array<TemplateStatus>;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public merchantId: number;

  public chainId: number;
  public contractType: Array<TokenType>;
  public contractModule: Array<ModuleType>;
}
