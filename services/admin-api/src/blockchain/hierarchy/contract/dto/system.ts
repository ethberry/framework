import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Transform } from "class-transformer";

// import { ModuleType } from "@framework/types";

export enum SystemModuleType {
  CONTRACT_MANAGER = "CONTRACT_MANAGER",
  EXCHANGE = "EXCHANGE",
  DISPENSER = "DISPENSER",
}

export class SystemContractSearchDto {
  @ApiProperty({
    enum: SystemModuleType,
  })
  @Transform(({ value }) => value as SystemModuleType)
  @IsEnum(SystemModuleType, { message: "badInput" })
  public contractModule: SystemModuleType;
}
