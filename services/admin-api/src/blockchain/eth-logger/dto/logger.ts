import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { AddressOptionalDto } from "@gemunion/collection";
import { ListenerType } from "@framework/types";

import { IEthLoggerInOutDto } from "../interfaces";

export class EthLoggerInOutDto extends AddressOptionalDto implements IEthLoggerInOutDto {
  @ApiProperty({
    enum: ListenerType,
  })
  @Transform(({ value }) => value as ListenerType)
  @IsEnum(ListenerType, { message: "badInput" })
  public listenerType: ListenerType;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  public chainId: number;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  public fromBlock: number;
}
