import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { Erc20ContractTemplate, IErc20ContractAutocompleteDto, UniContractStatus } from "@framework/types";

export class Erc20ContractAutocompleteDto implements IErc20ContractAutocompleteDto {
  @ApiPropertyOptional({
    enum: Erc20ContractTemplate,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc20ContractTemplate>)
  @IsEnum(Erc20ContractTemplate, { each: true, message: "badInput" })
  public contractTemplate: Array<Erc20ContractTemplate>;

  // not allowed
  public contractStatus: Array<UniContractStatus>;
}
