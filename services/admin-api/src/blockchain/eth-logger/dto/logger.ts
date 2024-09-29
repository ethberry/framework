import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AddressDto, ChainIdDto } from "@ethberry/nest-js-validators";
import { ListenerType } from "@framework/types";

import { IEthLoggerInOutDto } from "../interfaces";

export class EthLoggerInOutDto extends Mixin(AddressDto, ChainIdDto) implements IEthLoggerInOutDto {
  @ApiProperty({
    enum: ListenerType,
  })
  @Transform(({ value }) => value as ListenerType)
  @IsEnum(ListenerType, { message: "badInput" })
  public listenerType: ListenerType;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  public fromBlock: number;
}
