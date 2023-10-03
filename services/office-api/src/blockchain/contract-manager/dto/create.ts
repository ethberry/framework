import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, Min } from "class-validator";
import { Transform } from "class-transformer";

import { AddressDto } from "@gemunion/collection";
import { ContractType } from "@framework/types";

import type { IContractManagerCreateDto } from "../interfaces";

export class ContractManagerCreateDto extends AddressDto implements IContractManagerCreateDto {
  @ApiProperty({
    enum: ContractType,
  })
  @Transform(({ value }) => value as ContractType)
  @IsEnum(ContractType, { message: "badInput" })
  public contractType: ContractType;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public fromBlock: number;
}
