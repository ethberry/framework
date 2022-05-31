import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsEnum, IsString, IsInt, Min } from "class-validator";
import { Transform } from "class-transformer";

import { IContractManagerCreateDto } from "../interfaces";
import { ContractType } from "@framework/types";

export class ContractManagerCreateDto implements IContractManagerCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
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
