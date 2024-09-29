import { ApiProperty } from "@nestjs/swagger";
import { Mixin } from "ts-mixer";

import { PaginationDto } from "@ethberry/collection";
import { IsBigInt } from "@ethberry/nest-js-validators";

import { IEventHistoryTokenSearchDto } from "../interfaces";

export class EventHistoryTokenSearchDto extends Mixin(PaginationDto) implements IEventHistoryTokenSearchDto {
  @ApiProperty({
    type: Number,
    minimum: 1,
  })
  @IsBigInt({}, { message: "typeMismatch" })
  public tokenId: string;
}
