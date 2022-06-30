import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { IErc1155ContractAutocompleteDto, UniContractStatus } from "@framework/types";

export class Erc1155CollectionAutocompleteDto implements IErc1155ContractAutocompleteDto {
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
