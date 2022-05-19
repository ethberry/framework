import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, Min, IsEnum } from "class-validator";
import { Type, Transform } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { Erc1155TokenStatus, IErc1155TokenSearchDto } from "@framework/types";
import { IsBigNumber } from "@gemunion/nest-js-validators";

export class Erc1155TokenSearchDto extends SearchDto implements IErc1155TokenSearchDto {
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

  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
  })
  @IsOptional()
  @IsBigNumber({}, { message: "typeMismatch" })
  public tokenId: string;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsBigNumber({}, { message: "typeMismatch" })
  public minPrice: string;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsBigNumber({}, { message: "typeMismatch" })
  public maxPrice: string;

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
}
