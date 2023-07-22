import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { ListenerType } from "@framework/types";

import { AddressOptionalDto } from "../../../common/dto";
import { IEthLoggerInOutDto } from "../interfaces";

export class EthLoggerInOutDto extends AddressOptionalDto implements IEthLoggerInOutDto {
  @ApiPropertyOptional({
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
