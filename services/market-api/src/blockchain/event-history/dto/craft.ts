import { ApiProperty } from "@nestjs/swagger";
import { Mixin } from "ts-mixer";

import { PaginationDto } from "@ethberry/collection";
import { IsBigInt } from "@ethberry/nest-js-validators";

import { IEventHistoryCraftSearchDto } from "../interfaces";

export class EventHistoryCraftSearchDto extends Mixin(PaginationDto) implements IEventHistoryCraftSearchDto {
  @ApiProperty({
    type: Number,
    minimum: 1,
  })
  @IsBigInt({}, { message: "typeMismatch" })
  public craftId: string;
}
