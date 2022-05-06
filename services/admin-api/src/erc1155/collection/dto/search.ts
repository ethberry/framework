import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { Erc1155CollectionStatus, IErc1155CollectionSearchDto } from "@framework/types";
import { SearchDto } from "@gemunion/collection";

export class Erc1155CollectionSearchDto extends SearchDto implements IErc1155CollectionSearchDto {
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
