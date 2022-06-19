import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { Erc998CollectionStatus, Erc998CollectionType, IErc998CollectionSearchDto } from "@framework/types";
import { SearchDto } from "@gemunion/collection";

export class Erc998CollectionSearchDto extends SearchDto implements IErc998CollectionSearchDto {
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
}
