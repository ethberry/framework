import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { PaginationDto } from "@gemunion/collection";
import { ContractEventType } from "@framework/types";

export class EventHistorySearchDto2 extends PaginationDto {
  @ApiPropertyOptional({
    enum: ContractEventType,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<ContractEventType>)
  @IsEnum(ContractEventType, { each: true, message: "badInput" })
  public eventTypes: Array<ContractEventType>;
}
