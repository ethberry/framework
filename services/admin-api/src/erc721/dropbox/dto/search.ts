import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { Erc721DropboxStatus, IErc721DropboxSearchDto } from "@framework/types";
import { IsBigNumber } from "@gemunion/nest-js-validators";

export class Erc721DropboxSearchDto extends SearchDto implements IErc721DropboxSearchDto {
  @ApiPropertyOptional({
    enum: Erc721DropboxStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc721DropboxStatus>)
  @IsEnum(Erc721DropboxStatus, { each: true, message: "badInput" })
  public dropboxStatus: Array<Erc721DropboxStatus>;

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
}
