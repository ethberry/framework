import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { IErc1155TemplateAutocompleteDto, UniTemplateStatus } from "@framework/types";

export class Erc1155TemplateAutocompleteDto implements IErc1155TemplateAutocompleteDto {
  @ApiPropertyOptional({
    enum: UniTemplateStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<UniTemplateStatus>)
  @IsEnum(UniTemplateStatus, { each: true, message: "badInput" })
  public templateStatus: Array<UniTemplateStatus>;

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
  public uniContractIds: Array<number>;
}
