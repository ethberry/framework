import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { Erc721CollectionType, IErc721CollectionAutocompleteDto } from "@framework/types";

export class Erc721CollectionAutocompleteDto implements IErc721CollectionAutocompleteDto {
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
  public collectionType: Array<Erc721CollectionType> = Object.values(Erc721CollectionType);
}
