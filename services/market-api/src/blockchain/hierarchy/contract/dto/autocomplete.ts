import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { ContractRole, ContractStatus, ContractTemplate, IContractAutocompleteDto, TokenType } from "@framework/types";

export class ContractAutocompleteDto implements IContractAutocompleteDto {
  @ApiPropertyOptional({
    enum: ContractTemplate,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<ContractTemplate>)
  @IsEnum(ContractTemplate, { each: true, message: "badInput" })
  public contractTemplate: Array<ContractTemplate>;

  // not allowed
  contractStatus: Array<ContractStatus>;
  contractRole: Array<ContractRole>;
  contractType: Array<TokenType>;
}
