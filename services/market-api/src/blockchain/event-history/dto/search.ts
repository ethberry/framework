import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { PaginationDto, MuiSortDto } from "@gemunion/collection";
import { ContractEventType } from "@framework/types";
import { Mixin } from "ts-mixer";

export class EventHistorySearchDto2 extends Mixin(PaginationDto, MuiSortDto) {
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
