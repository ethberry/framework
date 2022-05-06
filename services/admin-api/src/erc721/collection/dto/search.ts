import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { Erc721CollectionStatus, Erc721CollectionType, IErc721CollectionSearchDto } from "@framework/types";
import { SearchDto } from "@gemunion/collection";

export class Erc721CollectionSearchDto extends SearchDto implements IErc721CollectionSearchDto {
  @ApiPropertyOptional({
    enum: Erc721CollectionStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc721CollectionStatus>)
  @IsEnum(Erc721CollectionStatus, { each: true, message: "badInput" })
  public collectionStatus: Array<Erc721CollectionStatus>;

  @ApiPropertyOptional({
    enum: Erc721CollectionType,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc721CollectionType>)
  @IsEnum(Erc721CollectionType, { each: true, message: "badInput" })
  public collectionType: Array<Erc721CollectionType>;
}
