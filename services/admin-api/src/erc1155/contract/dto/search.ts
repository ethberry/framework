import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { IErc1155ContractSearchDto, ContractStatus } from "@framework/types";
import { SearchDto } from "@gemunion/collection";

export class Erc1155CollectionSearchDto extends SearchDto implements IErc1155ContractSearchDto {
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
}
