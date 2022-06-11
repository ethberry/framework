import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { Erc1155CollectionStatus, IErc1155CollectionAutocompleteDto } from "@framework/types";

export class Erc1155CollectionAutocompleteDto implements IErc1155CollectionAutocompleteDto {
  @ApiPropertyOptional({
    enum: Erc1155CollectionStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc1155CollectionStatus>)
  @IsEnum(Erc1155CollectionStatus, { each: true, message: "badInput" })
  public collectionStatus: Array<Erc1155CollectionStatus>;
}
