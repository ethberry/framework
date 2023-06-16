import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

import { IsBigInt } from "@gemunion/nest-js-validators";
import type { IErc20TokenDeployDto } from "@framework/types";
import { Erc20ContractTemplates } from "@framework/types";

export class Erc20ContractDeployDto implements IErc20TokenDeployDto {
  @ApiProperty({
    enum: Erc20ContractTemplates,
  })
  @Transform(({ value }) => value as Erc20ContractTemplates)
  @IsEnum(Erc20ContractTemplates, { message: "badInput" })
  public contractTemplate: Erc20ContractTemplates;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  public name: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  public symbol: string;

  @ApiProperty({
    type: Number,
    minimum: 1,
    // maximum: BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
    // maximum: 115792089237316195423570985008687907853269984665640564039457584007913129639935n,
  })
  @IsBigInt(
    {
      minimum: 1n,
      maximum: 115792089237316195423570985008687907853269984665640564039457584007913129639935n,
    },
    { message: "typeMismatch" },
  )
  public cap: string;
}
