import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { Mixin } from "ts-mixer";

import { PaginationDto } from "@gemunion/collection";
import { ContractEventType, IEventHistorySearchDto } from "@framework/types";
import { IsBigInt } from "@gemunion/nest-js-validators";
import { AddressDto } from "../../../common/dto";

export class EventHistorySearchDto extends Mixin(PaginationDto, AddressDto) implements IEventHistorySearchDto {
  @ApiProperty({
    type: Number,
    minimum: 1,
  })
  @IsBigInt({}, { message: "typeMismatch" })
  public tokenId: string;
}

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
