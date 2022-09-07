import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsEthereumAddress, IsInt, IsString, Min } from "class-validator";
import { Transform } from "class-transformer";

import { ContractType } from "@framework/types";

import { IContractManagerCreateDto } from "../interfaces";

export class ContractManagerCreateDto implements IContractManagerCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public address: string;

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
