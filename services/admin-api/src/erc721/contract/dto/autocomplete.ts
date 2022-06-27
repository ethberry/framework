import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { UniContractStatus, UniContractType, IErc721ContractAutocompleteDto } from "@framework/types";

export class Erc721CollectionAutocompleteDto implements IErc721ContractAutocompleteDto {
  @ApiPropertyOptional({
    enum: UniContractType,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<UniContractType>)
  @IsEnum(UniContractType, { each: true, message: "badInput" })
  public contractType: Array<UniContractType>;

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
}
