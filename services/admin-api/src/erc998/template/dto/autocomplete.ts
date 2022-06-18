import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { Erc998TemplateStatus, IErc998TemplateAutocompleteDto } from "@framework/types";

export class Erc998TemplateAutocompleteDto implements IErc998TemplateAutocompleteDto {
  @ApiPropertyOptional({
    enum: Erc998TemplateStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc998TemplateStatus>)
  @IsEnum(Erc998TemplateStatus, { each: true, message: "badInput" })
  public templateStatus: Array<Erc998TemplateStatus>;

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
  public erc998CollectionIds: Array<number>;
}
