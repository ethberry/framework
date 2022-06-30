import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { IErc998CollectionAutocompleteDto, UniContractRole, UniContractStatus } from "@framework/types";

export class Erc998CollectionAutocompleteDto implements IErc998CollectionAutocompleteDto {
  @ApiPropertyOptional({
    enum: UniContractStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<UniContractStatus>)
  @IsEnum(UniContractStatus, { each: true, message: "badInput" })
  public contractStatus: Array<UniContractStatus>;

  @ApiPropertyOptional({
    enum: UniContractRole,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<UniContractRole>)
  @IsEnum(UniContractRole, { each: true, message: "badInput" })
  public contractRole: Array<UniContractRole>;
}
