import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { Mixin } from "ts-mixer";

import { ChainIdDto } from "@gemunion/nest-js-validators";
import { SearchDto } from "@gemunion/collection";
import type { IContractSearchDto } from "@framework/types";
import { ContractFeatures, ContractStatus } from "@framework/types";

export class ContractSearchDto extends Mixin(SearchDto, ChainIdDto) implements IContractSearchDto {
  @ApiPropertyOptional({
    enum: ContractStatus,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<ContractStatus>)
  @IsEnum(ContractStatus, { each: true, message: "badInput" })
  public contractStatus: Array<ContractStatus>;

  @ApiPropertyOptional({
    enum: ContractFeatures,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<ContractFeatures>)
  @IsEnum(ContractFeatures, { each: true, message: "badInput" })
  public contractFeatures: Array<ContractFeatures>;

  public merchantId: number;
}
