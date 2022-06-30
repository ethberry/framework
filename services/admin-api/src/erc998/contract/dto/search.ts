import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { IErc998ContractSearchDto, ContractRole, ContractStatus } from "@framework/types";
import { SearchDto } from "@gemunion/collection";

export class Erc998CollectionSearchDto extends SearchDto implements IErc998ContractSearchDto {
  @ApiPropertyOptional({
    enum: ContractStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<ContractStatus>)
  @IsEnum(ContractStatus, { each: true, message: "badInput" })
  public contractStatus: Array<ContractStatus>;

  @ApiPropertyOptional({
    enum: ContractRole,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<ContractRole>)
  @IsEnum(ContractRole, { each: true, message: "badInput" })
  public contractRole: Array<ContractRole>;
}
