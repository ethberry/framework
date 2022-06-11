import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { Erc1155TokenStatus, IErc1155TokenAutocompleteDto } from "@framework/types";

export class Erc1155TokenAutocompleteDto implements IErc1155TokenAutocompleteDto {
  @ApiPropertyOptional({
    enum: Erc1155TokenStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc1155TokenStatus>)
  @IsEnum(Erc1155TokenStatus, { each: true, message: "badInput" })
  public tokenStatus: Array<Erc1155TokenStatus>;

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
  public erc1155CollectionIds: Array<number>;
}
