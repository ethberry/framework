import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Transform } from "class-transformer";

import type { ISystemContractSearchDto } from "@framework/types";
import { SystemModuleType } from "@framework/types";

export class SystemContractSearchDto implements ISystemContractSearchDto {
  @ApiProperty({
    enum: SystemModuleType,
  })
  @Transform(({ value }) => value as SystemModuleType)
  @IsEnum(SystemModuleType, { message: "badInput" })
  public contractModule: SystemModuleType;

  public chainId: number;
}
