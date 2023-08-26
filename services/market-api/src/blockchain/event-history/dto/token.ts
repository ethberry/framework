import { ApiProperty } from "@nestjs/swagger";
import { Mixin } from "ts-mixer";
import { IsEthereumAddress, IsString } from "class-validator";
import { Transform } from "class-transformer";

import { PaginationDto } from "@gemunion/collection";
import { IsBigInt } from "@gemunion/nest-js-validators";

import { IEventHistoryTokenSearchDto } from "../interfaces";

export class EventHistoryTokenSearchDto extends Mixin(PaginationDto) implements IEventHistoryTokenSearchDto {
  @ApiProperty({
    type: Number,
    minimum: 1,
  })
  @IsBigInt({}, { message: "typeMismatch" })
  public tokenId: string;
}
