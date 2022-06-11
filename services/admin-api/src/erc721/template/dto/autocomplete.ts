import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { Erc721TemplateStatus, IErc721TemplateAutocompleteDto } from "@framework/types";

export class Erc721TemplateAutocompleteDto implements IErc721TemplateAutocompleteDto {
  @ApiPropertyOptional({
    enum: Erc721TemplateStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc721TemplateStatus>)
  @IsEnum(Erc721TemplateStatus, { each: true, message: "badInput" })
  public templateStatus: Array<Erc721TemplateStatus>;

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
  public erc721CollectionIds: Array<number>;
}
