import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { Mixin } from "ts-mixer";

import { MuiSortDto, PaginationDto } from "@ethberry/collection";
import { ContractEventType } from "@framework/types";
import type { IDateBase } from "@ethberry/types-collection";

export class EventHistorySearchDto2 extends Mixin(PaginationDto, MuiSortDto<IDateBase>) {
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
