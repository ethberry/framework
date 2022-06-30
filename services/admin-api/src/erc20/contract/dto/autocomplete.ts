import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { Erc20ContractTemplate, IErc20ContractAutocompleteDto, ContractStatus } from "@framework/types";

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

  @ApiPropertyOptional({
    enum: ContractStatus,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<ContractStatus>)
  @IsEnum(ContractStatus, { each: true, message: "badInput" })
  public contractStatus: Array<ContractStatus>;
}
