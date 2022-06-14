import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { Erc998CollectionStatus, Erc998CollectionType, IErc998CollectionAutocompleteDto } from "@framework/types";

export class Erc998CollectionAutocompleteDto implements IErc998CollectionAutocompleteDto {
  @ApiPropertyOptional({
    enum: Erc998CollectionType,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc998CollectionType>)
  @IsEnum(Erc998CollectionType, { each: true, message: "badInput" })
  public collectionType: Array<Erc998CollectionType>;

  @ApiPropertyOptional({
    enum: Erc998CollectionStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc998CollectionStatus>)
  @IsEnum(Erc998CollectionStatus, { each: true, message: "badInput" })
  public collectionStatus: Array<Erc998CollectionStatus>;
}
