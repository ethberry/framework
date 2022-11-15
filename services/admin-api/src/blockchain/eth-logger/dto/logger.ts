import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

import { ListenerType } from "@framework/types";
import { IEthLoggerInOutDto } from "../interfaces";

export class EthLoggerInOutDto implements IEthLoggerInOutDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public address: string;

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
